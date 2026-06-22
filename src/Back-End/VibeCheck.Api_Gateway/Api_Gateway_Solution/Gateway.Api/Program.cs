using Gateway.Application;
using Gateway.Domain.Constants;
using Gateway.Infra;
using Gateway.Domain.Interfaces;
using Gateway.Application.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Insira o token JWT desta maneira: Bearer {seu token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddApplication(builder.Configuration);
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddHttpContextAccessor();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddHttpClient("AuthClient", config =>
{
    config.BaseAddress = new Uri(RoutesConstants.AuthRoute);
    config.DefaultRequestHeaders.Add("Accept", "application/json");
    config.Timeout = TimeSpan.FromSeconds(30);
});

builder.Services.AddHttpClient("DiarioClient", config =>
{
    config.BaseAddress = new Uri(RoutesConstants.DiarioRoute);
    config.DefaultRequestHeaders.Add("Accept", "application/json");
    config.Timeout = TimeSpan.FromSeconds(30);
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });


builder.Services.AddHttpClient("AtividadesClient", config =>
{
    config.BaseAddress = new Uri(RoutesConstants.ActivityRoute);
    config.DefaultRequestHeaders.Add("Accept", "application/json");
    config.Timeout = TimeSpan.FromSeconds(30);
});


builder.Services.AddScoped<IActivityServices, ActivityServices>();

builder.Services.AddHttpClient("DiarioClient", client =>
{
    client.BaseAddress = new Uri(RoutesConstants.DiarioRoute);
});

builder.Services.AddScoped<IPsiDiaryServices, PsiDiaryServices>();

builder.Services.AddHttpClient("FeedbackService", config =>
{
    config.BaseAddress = new Uri(RoutesConstants.FeedbackRoute);
    config.DefaultRequestHeaders.Add("Accept", "application/json");
    config.Timeout = TimeSpan.FromSeconds(30);
});

builder.Services.AddScoped<IFeedbackServices, FeedbackServices>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}



app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();