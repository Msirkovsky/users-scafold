using Scaffolding.Entity.Access;
using Scaffolding.Entity.Common.Scheduler;
using Scaffolding.Entity.Login;
using Scaffolding.Entity.Services.Notifications;
using Scaffolding.Entity.Services.Users;
using Microsoft.Extensions.DependencyInjection;

namespace Scaffolding.Entity
{
    public static class EntityRegistrator
    {

        public static void RegisterEverything(IServiceCollection services)
        {
            services.AddTransient<LoginInfoQuery>();
            services.AddTransient<ICommunicationService, CommunicationService>();
            services.AddTransient<ISmtpClientWrapper, SmtpClientWrapper>();
            services.AddTransient<NewUserInsertedHandler>();
            services.AddTransient<EmailSender>();
            services.AddTransient<IAccessService, AccessService>();
            services.AddTransient<IUserAccess, UserAccess>();
            services.AddTransient<ISchedulerService, SchedulerService>();
        }
    }
}