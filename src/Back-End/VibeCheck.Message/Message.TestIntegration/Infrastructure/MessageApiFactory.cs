using Message.Domain.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Message.TestIntegration.Infrastructure
{
    public class MessageApiFactory : WebApplicationFactory<Program>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            Environment.SetEnvironmentVariable("JWT_SECRET_KEY", "test-secret-key-1234567890");
            Environment.SetEnvironmentVariable("FRONTEND_URL", "http://localhost");

            builder.ConfigureAppConfiguration((context, configBuilder) =>
            {
                var settings = new Dictionary<string, string?>
                {
                    ["JWT_SECRET_KEY"] = "test-secret-key-1234567890",
                    ["FRONTEND_URL"] = "http://localhost"
                };

                configBuilder.AddInMemoryCollection(settings);
            });

            builder.ConfigureServices(services =>
            {
                services.RemoveAll<IChatRepository>();
                services.RemoveAll<IMessageRepository>();

                services.AddSingleton<IChatRepository, InMemoryChatRepository>();
                services.AddSingleton<IMessageRepository, InMemoryMessageRepository>();

                services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = TestAuthHandler.SchemeName;
                    options.DefaultChallengeScheme = TestAuthHandler.SchemeName;
                }).AddScheme<AuthenticationSchemeOptions, TestAuthHandler>(TestAuthHandler.SchemeName, _ => { });

                services.AddAuthorization(options =>
                {
                    options.DefaultPolicy = new AuthorizationPolicyBuilder(TestAuthHandler.SchemeName)
                        .RequireAuthenticatedUser()
                        .Build();
                });
            });
        }
    }
}
