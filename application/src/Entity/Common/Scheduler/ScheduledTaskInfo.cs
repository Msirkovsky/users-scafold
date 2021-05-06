using System;

namespace Scaffolding.Entity.Common.Scheduler
{
    [Serializable]
    public sealed class ScheduledTaskInfo
    {
        public ScheduledTaskInfo()
        {
        }
        public ScheduledTaskInfo(IScheduledTask scheduledTask)
            : this()
        {
            ScheduledTask = scheduledTask;
            StartTime = DateTime.Now;
        }
        public IScheduledTask ScheduledTask { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public ScheduledTaskResult Result { get; private set; }

        public void SetResult(ScheduledTaskResult result)
        {
            EndTime = DateTime.Now;
            Result = result;
        }
    }
}