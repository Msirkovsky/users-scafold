using System;
using System.Collections.Generic;
using System.Linq;
using Scaffolding.Entity.Services.Notifications;

namespace Scaffolding.Entity.Common.Scheduler
{
    public class SchedulerService : ISchedulerService
    {
        private readonly EmailSender _emailSender;

        public SchedulerService(EmailSender emailSender)
        {
            _emailSender = emailSender;
        }

        public string Test()
        {
            return "test";
        }

        public string Run()
        {
            //TODO test email
            //todo dát někam jinam? pozor na DI - staticke instance to budou
            ScheduledTaskRunner.Run(new List<ScheduledTaskForRun>
            {
                 new ScheduledTaskForRun(new SendEmailsTask(_emailSender), TimeSpan.FromMinutes(20),
                     ScheduledTaskStartType.Opakovane, true),

            });

            var arr = ScheduledTaskRunner.ScheduledTasksHistory.Where(x => x.StartTime > DateTime.Now.AddDays(-1))
                .Select(x =>
                    "Task: " +
                    x.ScheduledTask.Name +
                    " Last run:" +
                    x.StartTime +
                    " Result:" +
                    (x.Result.Ok
                        ? "<span style='color:green'>Success</span>"
                        : "<span style='color:red'>" + x.Result.Exception.ToString() + "</span>")).ToArray();

            return String.Join("<br/>", arr);
        }
    }

    public class SendEmailsTask : IScheduledTask
    {
        private readonly EmailSender _emailSender;

        public SendEmailsTask(EmailSender emailSender)
        {
            _emailSender = emailSender;
        }

        public string Name => "Posílání emailů";

        private static readonly object _lock = new object();

        public ScheduledTaskResult Run()
        {
            lock (_lock)
            {
                _emailSender.SendWithLock(15);
                return ScheduledTaskResult.Success();
            }
        }
    }
}