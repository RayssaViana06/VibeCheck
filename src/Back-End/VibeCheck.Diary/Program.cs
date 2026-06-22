using MongoDB.Driver;
using System.Text;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using VibeCheck_v1.Repositories;
using VibeCheck_v1.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// MongoDB
builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var connectionString = builder.Configuration.GetSection("MongoDbSettings:ConnectionString").Value;
    return new MongoClient(connectionString);
});

// Serviços
builder.Services.AddHttpClient<IAIService, AIService>();
builder.Services.AddScoped<DiaryRepository>();
builder.Services.AddScoped<JwtService>();

// JWT usando configurações em "Jwt" (appsettings ou variáveis de ambiente)
var keyString = builder.Configuration["Jwt:Key"]
    ?? throw new Exception("Jwt:Key não configurado.");
var key = Encoding.UTF8.GetBytes(keyString);

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "auth-service",
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "vibecheck-app",
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateLifetime = true,
            RoleClaimType = ClaimTypes.Role
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();