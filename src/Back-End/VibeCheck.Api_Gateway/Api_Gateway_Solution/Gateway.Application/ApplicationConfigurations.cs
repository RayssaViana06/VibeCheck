using Gateway.Application.Services;
using Gateway.Domain.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Gateway.Application
{
    public static class ApplicationConfigurations
    {
        public static void AddApplication(this IServiceCollection services, IConfiguration configuration)
        {

            services.AddScoped<IUserServices, UserServices>();
            services.AddScoped<IMessageAppServices, MessageApplicationServices>();
        }
    }
}
