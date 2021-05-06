using System;

namespace Scaffolding.Entity.Common.Scheduler
{
    public class ScheduledTaskForRun
    {
        public ScheduledTaskForRun(IScheduledTask scheduledTask, TimeSpan periodTime, ScheduledTaskStartType scheduledTaskStartType, bool tryNextRunAfterError)
        {
            ScheduledTask = scheduledTask;
            PeriodTime = periodTime;
            ScheduledTaskStartType = scheduledTaskStartType;
            TryNextRunAfterError = tryNextRunAfterError;
        }

        public IScheduledTask ScheduledTask { get; set; }
        public TimeSpan PeriodTime { get; set; }
        public ScheduledTaskStartType ScheduledTaskStartType { get; set; }
        public bool TryNextRunAfterError { get; set; }
    }
}