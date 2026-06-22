using Microsoft.Extensions.DependencyInjection;

namespace Message.Application
{
    public static class ApplicationConfiguraion
    {
        public static void AddApplication(this IServiceCollection services)
        {
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(ApplicationConfiguraion).Assembly));
        }
    }
}
