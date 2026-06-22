using Message.Domain.Constants;
using Message.Domain.Interfaces;
using Message.Infra.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;

namespace Message.Infra
{
    public static class AppInfrastructureConfiguration
    {
        public static void AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddSingleton<IMongoClient>(sp =>
            {
                var connectionString = configuration[DbConstants.MONGO_URI_MESSAGE];
                return new MongoClient(connectionString);
            });

            services.AddScoped<IChatRepository, ChatRepository>();
            services.AddScoped<IMessageRepository, MessageRepository>();
        }

    }
}
