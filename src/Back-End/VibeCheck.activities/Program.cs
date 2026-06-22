using Atividades.Models;
using Atividades.Services;
using Atividades.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

var builder = WebApplication.CreateBuilder(args);

var mongoSettings = builder.Configuration
    .GetSection("MongoDB")
    .Get<MongoSettings>() ?? new MongoSettings();

builder.Services.AddSingleton<IMongoClient>(_ => new MongoClient(mongoSettings.ConnectionString));

builder.Services.AddSingleton(sp =>
    sp.GetRequiredService<IMongoClient>()
      .GetDatabase(mongoSettings.DatabaseName));

builder.Services.AddSingleton(sp =>
    sp.GetRequiredService<IMongoDatabase>()
      .GetCollection<Activity>(mongoSettings.ActivitiesCollection));

var diarioSettings = builder.Configuration
    .GetSection("DiarioDB")
    .Get<DiarioSettings>() ?? new DiarioSettings();

builder.Services.AddSingleton(sp =>
{
    var client = new MongoClient(diarioSettings.ConnectionString);
    return client
        .GetDatabase(diarioSettings.DatabaseName)
        .GetCollection<DiarioEntrada>(diarioSettings.DiarioCollection);
});

var jwtSettings = builder.Configuration
    .GetSection("Jwt")
    .Get<JwtSettings>() ?? new JwtSettings();

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
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
                                           Encoding.UTF8.GetBytes(jwtSettings.SecretKey))
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddSingleton<ActivityService>();
builder.Services.AddSingleton<DiarioService>();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Informe o token JWT. Ex: Bearer eyJhbGci..."
    });
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id   = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    app.MapGet("/dev/token", () =>
    {
        if (string.IsNullOrEmpty(jwtSettings.SecretKey))
            return Results.BadRequest("Configure a SecretKey em appsettings.json → seção 'Jwt'.");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim("sub", "psicologo-teste-id-001"),
            new Claim(ClaimTypes.Name, "Dr. Teste Silva"),
            new Claim(ClaimTypes.Email, "teste@psicologia.com")
        };

        var token = new JwtSecurityToken(
            issuer: jwtSettings.Issuer,
            audience: jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: creds
        );

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        return Results.Ok(new
        {
            token = tokenString,
            expiraEm = DateTime.UtcNow.AddHours(8),
            uso = "Copie 'token' e cole no Swagger → Authorize → Bearer {token}"
        });

    }).AllowAnonymous();
}

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapGet("/", () => Results.Redirect("/swagger"));
app.MapGet("/health", () => Results.Ok(new { status = "Healthy", utcNow = DateTime.UtcNow }));

app.Run();

public partial class Program { }