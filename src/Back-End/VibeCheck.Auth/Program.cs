using auth_service.Services;
using auth_service.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using NSwag;
using System.Text;
using VibeCheck.Constantes;
using VibeCheck.Interfaces;
using VibeCheck.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var mongoSettings = builder.Configuration
    .GetSection("MongoDB")
    .Get<MongoDBSettings>();

mongoSettings!.ConnectionString =
    builder.Configuration.GetConnectionString("MongoDB")!;

builder.Services.AddSingleton<IMongoClient>(s =>
    new MongoClient(mongoSettings.ConnectionString));

builder.Services.AddScoped<ICriarChat, CriarChatService>();

builder.Services.AddHttpClient("ChatService", config => {
    config.BaseAddress = new Uri(ApiRoutes.URI_CHAT);
});
builder.Services.AddSingleton(s =>
{
    var client = s.GetRequiredService<IMongoClient>();
    return client.GetDatabase(mongoSettings.DatabaseName);
});

builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<LinkService>();
builder.Services.AddScoped<BlacklistService>();

var jwtSettings = builder.Configuration
    .GetSection("Jwt")
    .Get<JwtSettings>()!;

builder.Services.AddSingleton(jwtSettings);
builder.Services.AddSingleton<TokenService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings.Key))
        };
    });

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddOpenApiDocument(config =>
{
    config.Title = "VibeCheck Auth API";

    config.AddSecurity("Bearer", new OpenApiSecurityScheme
    {
        Type = OpenApiSecuritySchemeType.ApiKey,
        Name = "Authorization",
        In = OpenApiSecurityApiKeyLocation.Header,
        Description = "Digite: Bearer {seu token}"
    });
});

var internalApiConfig = builder.Configuration
    .GetSection("InternalApi")
    .Get<InternalApiSettings>()!;

builder.Services.AddSingleton(internalApiConfig);

var app = builder.Build();

var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";

app.Urls.Add($"http://0.0.0.0:{port}");

app.UseOpenApi();

app.UseSwaggerUi();

app.UseCors();

app.UseAuthentication();

app.UseMiddleware<auth_service.Middlewares.BlacklistMiddleware>();

app.UseAuthorization();

app.MapControllers();

app.Run();