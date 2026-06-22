using Gateway.Application.Services;
using Gateway.Domain.Constants;
using Gateway.Domain.Interfaces;
using Gateway.Infra.Services.MessageService;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Gateway.Infra
{
    public static class InfrastructureConfiguration
    {
        public static void AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddHttpClient("AuthClient", config =>
            {
                config.BaseAddress = new Uri(RoutesConstants.AuthRoute);
                config.DefaultRequestHeaders.Add("Accept", "application/json");
                config.Timeout = TimeSpan.FromSeconds(30);
            });

            services.AddHttpClient("MessageClient", config =>
            {
                config.BaseAddress = new Uri(RoutesConstants.MessageRoute);
                config.DefaultRequestHeaders.Add("Accept", "application/json");
                config.Timeout = TimeSpan.FromSeconds(30);
            });

            services.AddHttpClient("FeedbackService", config =>
            {
                config.BaseAddress = new Uri(RoutesConstants.FeedbackRoute);
                config.DefaultRequestHeaders.Add("Accept", "application/json");
                config.Timeout = TimeSpan.FromSeconds(30);
            });

            services.AddHttpClient("DiaryFilterService", config =>
            {
                config.BaseAddress = new Uri(RoutesConstants.DiaryFilterRoute);
                config.DefaultRequestHeaders.Add("Accept", "application/json");
                config.Timeout = TimeSpan.FromSeconds(30);
            });

            services.AddScoped<IAuthBase, AuthServices>();
            services.AddScoped<IMessageService, MessageService>();
            services.AddScoped<IFeedbackServices, Gateway.Application.Services.FeedbackServices>();
            services.AddScoped<IDiaryFilterServices, DiaryFilterServices>();
        }
    }
}