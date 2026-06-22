using Message.Domain.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Message.TestIntegration.Infrastructure
{
    public class MessageApiSystemFactory : WebApplicationFactory<Program>
    {
        public const string JwtKey = "test-secret-key-1234567890-abcdef";
        public const string FrontendUrl = "http://localhost";

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            Environment.SetEnvironmentVariable("JWT_SECRET_KEY", JwtKey);
            Environment.SetEnvironmentVariable("FRONTEND_URL", FrontendUrl);

            builder.ConfigureAppConfiguration((context, configBuilder) =>
            {
                var settings = new Dictionary<string, string?>
                {
                    ["JWT_SECRET_KEY"] = JwtKey,
                    ["FRONTEND_URL"] = FrontendUrl
                };

                configBuilder.AddInMemoryCollection(settings);
            });

            builder.ConfigureServices(services =>
            {
                services.RemoveAll<IChatRepository>();
                services.RemoveAll<IMessageRepository>();

                services.AddSingleton<IChatRepository, InMemoryChatRepository>();
                services.AddSingleton<IMessageRepository, InMemoryMessageRepository>();
            });
        }
    }
}
