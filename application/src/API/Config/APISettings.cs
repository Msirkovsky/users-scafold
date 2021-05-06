using API.Models.Users;
using API.Services.Common;
using API.Services.Users;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using My.Shared.WebApi.Configurations;
using My.Shared.WebApi.Extensions;
using Scaffolding.Entity;
using Scaffolding.Entity.Services.Notifications;

namespace API.Config
{
  
    public class APISettings : ICoreServiceSettings
    {
        public void ConfigureService(IServiceCollection services, IConfigurationRoot configuration)
        {
            services.AddTransient<UserReadService>();
            services.AddTransient<UserWriteService>();
            services.AddTransient<MapperService>();
            services.ConfigureSection<APIConfig>(configuration);
            services.ConfigureSection<NotificationConfig>(configuration);
            services.ConfigureSection<SmtpConfig>(configuration);
        }

        public void Configure(IApplicationBuilder app, ILoggerFactory loggerFactory)
        {

        }
    }
}