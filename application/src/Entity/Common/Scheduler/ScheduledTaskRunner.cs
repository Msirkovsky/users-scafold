using System;
using System.Collections.Generic;

namespace Scaffolding.Entity.Common.Scheduler
{
    public static class ScheduledTaskRunner
    {
        private static readonly object _lock = new object();
        public static List<ScheduledTaskInfo> ScheduledTasksHistory { get; } = new List<ScheduledTaskInfo>();
        public static Dictionary<Type, DateTime> LastTasks { get; } = new Dictionary<Type, DateTime>();
        public static List<ScheduledTaskForRun> ScheduledTasksForRun { get; private set; } = new List<ScheduledTaskForRun>();

        public static void Run(List<ScheduledTaskForRun> scheduledTasks)
        {
            ScheduledTasksForRun = scheduledTasks;
            Run();
        }
        public static void AddScheduledTask(IScheduledTask scheduledTask, TimeSpan periodTime, ScheduledTaskStartType scheduledTaskStartType = ScheduledTaskStartType.Opakovane, bool tryNextRunAfterError = false, bool removeTasksOfSameType = true)
        {
            if (removeTasksOfSameType)
            {
                ScheduledTasksForRun.RemoveAll(w => w.ScheduledTask.GetType() == scheduledTask.GetType());
            }
            ScheduledTasksForRun.Add(new ScheduledTaskForRun(scheduledTask, periodTime, scheduledTaskStartType, tryNextRunAfterError ));
        }

        public static void Run()
        {
            lock (_lock)
            {
                var actualTime = DateTime.Now;
                ScheduledTasksForRun.ForEach(task =>
                {
                    var taskType = task.ScheduledTask.GetType();
                    DateTime? lastTaskTime = null;
                    if (LastTasks.TryGetValue(taskType, out var time))
                    {
                        lastTaskTime = time;
                    }

                    if (task.ScheduledTaskStartType == ScheduledTaskStartType.Opakovane &&
                        (lastTaskTime == null || lastTaskTime.Value.Add(task.PeriodTime) < actualTime)
                        || task.ScheduledTaskStartType == ScheduledTaskStartType.JednouDenne &&
                        (lastTaskTime == null || lastTaskTime.Value.Date < actualTime) &&
                        task.PeriodTime < actualTime.TimeOfDay
                    )
                    {
                        var info = new ScheduledTaskInfo(task.ScheduledTask);
                        ScheduledTasksHistory.Add(info);

                        try
                        {
                            info.SetResult(task.ScheduledTask.Run());
                        }
                        catch (Exception exc)
                        {
                            info.SetResult(new ScheduledTaskResult {Ok = false, Exception = exc});
                        }

                        if (info.Result.Ok || task.TryNextRunAfterError == false)
                        {
                            if (lastTaskTime == null)
                            {
                                LastTasks.Add(taskType, actualTime);
                            }
                            else
                            {
                                LastTasks[taskType] = actualTime;
                            }
                        }
                    }

                });
            }
        }
    }
}