using System;

namespace Scaffolding.Entity.Common.Scheduler
{
    public class ScheduledTaskResult
    {
        public static ScheduledTaskResult Success()
        {
            return new ScheduledTaskResult
            {
                Ok = true
            };
        }

        public ScheduledTaskResult()
        {
            Ok = false;
            Description = string.Empty;
        }

        public bool Ok { get; set; }

        public string Description { get; set; }

        public Exception Exception { get; set; }

        public void AddDescription(string oteherDescription)
        {
            Description += $";{oteherDescription}";
        }
    }
}