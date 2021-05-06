using Microsoft.Extensions.DependencyInjection;
using My.Shared.Authentication;

namespace API
{
    public static class ApiRegistrator
    {
        public static void RegisterEverything(IServiceCollection services)
        {
            services.AddTransient<ICurrentTokenProvider, CurrentTokenProvider>();
            services.AddTransient<ICurrentUserProvider, CurrentUserProvider>();
        }
    }
}
