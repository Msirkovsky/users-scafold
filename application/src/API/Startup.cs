using System.Text;
using API.Config;
using API.Infrastructure;
using API.Models.Users;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using My.Shared.Authentication;
using My.Shared.Authentication.Config;
using My.Shared.WebApi.Configurations;
using My.Shared.WebApi.ExceptionsMapping;
using My.Shared.WebApi.Extensions;
using Scaffolding.Entity;
using Scaffolding.Entity.EF;
using Scaffolding.Entity.Entities.Users;
using Configurations = API.Config.Configurations;

namespace API
{
    public class Startup
    {
        private readonly ICoreSettings _settings;
        private readonly IConfigurationRoot _rootConfiguration;

        public Startup(IHostingEnvironment env)
        {
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
            _rootConfiguration = GetConfigurationRoot(env);
            _settings = new CoreSettings(_rootConfiguration)
                .SetMvc(options => options.Cors = true);

            _settings.AddConfiguration(new APISettings());
        }

        internal static IConfigurationRoot BaseConfigSection { get; set; }

        internal static string HostAddress { get; set; }

        public void ConfigureServices(IServiceCollection services)
        {

            services.AddDbContext<EntityContext>(
                options => { options.UseNpgsql(_rootConfiguration.GetConnectionString("EntityContext")); },
                contextLifetime: ServiceLifetime.Transient,
                optionsLifetime: ServiceLifetime.Singleton
            );
            _settings.ConfigureServices(services);

            //Policy example!
            //services.AddAuthorization(x => x.AddPolicy(PolicyConst.Example,
            //    p => p.RequireAssertion(ctx => ));

            services.ConfigureSection<AuthenticationConfig>(_rootConfiguration);

            var key = _rootConfiguration.GetSection("Authentication:Key").Value;

            var auth = services.AddAuthentication(o =>
            {
                o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                o.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
            });

            auth.AddJwtBearer(cfg =>
            {
                cfg.RequireHttpsMetadata = false;
                cfg.SaveToken = true;
                cfg.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = "TODO",
                    ValidAudience = "TODO",
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
                };
            });

            ApiRegistrator.RegisterEverything(services);
            EntityRegistrator.RegisterEverything(services);
        }

        public void Configure(
            IApplicationBuilder app,
            ILoggerFactory loggerFactory)
        {
            app.UseMiddleware<MapExceptionsToStatusCodeMiddleware>(new ExceptionToHttpCodeMapper());
            loggerFactory.AddConsole(LogLevel.Trace);
            app.UseAuthentication2(true);

            app.UseMiddleware<HandleNotFoundMiddleware>();
            _settings.Configure(app, loggerFactory);

            AutomapperSetup();
        }

        private void AutomapperSetup()
        {
            AutoMapper.Mapper.Initialize(c =>
            {
                c.CreateMap<UserEditModel, UserEditModel>();
                c.CreateMap<User, User>();
                c.CreateMap<User, UserEditModel>().ReverseMap();
                c.CreateMap<UserRole, UserRole>();
                var converterUserRoles = CollectionConverterWithIdentityMatching<UserRole, UserRole>.Instance(model => model.Id, model => model.Id);
                c.CreateMap<UserRole[], UserRole[]>().ConvertUsing(converterUserRoles);
            });
        }


        public static IConfigurationBuilder CreateConfigurationBuilder(string path, string environment)
        {
            var configBuilder = new ConfigurationBuilder()
                .SetBasePath(path)
                .AddJsonFile(Configurations.GetConfigFileName(), true)
                .AddJsonFile(Configurations.GetConfigFileName(environment), true)
                .AddEnvironmentVariables();
            return configBuilder;
        }

        private IConfigurationRoot GetConfigurationRoot(IHostingEnvironment env)
        {
            return BaseConfigSection ?? CreateConfigurationBuilder(env.ContentRootPath, env.EnvironmentName).Build();
        }
    }
}
