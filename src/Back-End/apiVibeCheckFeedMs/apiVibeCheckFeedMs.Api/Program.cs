using apiVibeCheckFeedMs.Api.Services;
using apiVibeCheckFeedMs.Domain.Interfaces;
using apiVibeCheckFeedMs.Infra.Configurations;
using apiVibeCheckFeedMs.Infra.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddScoped<FeedbackService>();
builder.Services.Configure<MongoDbSettings>(
    builder.Configuration.GetSection("MongoDbSettings"));
builder.Services.AddSingleton<IFeedbackRepository, FeedbackRepository>();

// JWT
var key = Encoding.UTF8.GetBytes(builder.Configuration["JWT_SECRET_KEY"]
    ?? throw new Exception("JWT_SECRET_KEY não configurada."));

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = "auth-service",
            ValidateAudience = true,
            ValidAudience = "vibecheck-app",
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateLifetime = true,
            RoleClaimType = ClaimTypes.Role
        };
    });

var app = builder.Build();

// HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
app.Run($"http://0.0.0.0:{port}");

public partial class Program { }