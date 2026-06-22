using MediatR;
using Message.Api.Hubs;
using Message.Api.Middleware;
using Message.Application;
using Message.Application.Commands;
using Message.Infra;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddEnvironmentVariables();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplication();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "APIContagem", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description =
            "JWT Authorization Header - utilizado com Bearer Authentication.\r\n\r\n" +
            "Digite 'Bearer' [espaço] e então seu token no campo abaixo.\r\n\r\n" +
            "Exemplo (informar sem as aspas): 'Bearer 12345abcdef'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme()
            {
                Reference = new OpenApiReference()
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});
builder.Services.AddSignalR();
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        var frontendUrl = builder.Configuration["FRONTEND_URL"];

        if (!string.IsNullOrEmpty(frontendUrl))
        {
            policy.WithOrigins(frontendUrl.Replace(" ", "").Split(','));
        }
        else
        {
            policy.SetIsOriginAllowed(_ => true);
        }

        policy
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials(); 
    });
});

var key = Encoding.UTF8.GetBytes(builder.Configuration["JWT_SECRET_KEY"]);

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

            ValidateLifetime = true
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];

                var path = context.HttpContext.Request.Path;

                if (!string.IsNullOrEmpty(accessToken) &&
                    path.StartsWithSegments("/message/hub"))
                {
                    context.Token = accessToken;
                }

                return Task.CompletedTask;
            }
        };
    });



// Add services to the container.

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


// Configure the HTTP request pipeline.
app.UseCors("CorsPolicy");

app.UseHttpsRedirection();

app.UseAuthentication();  
app.UseAuthorization();
app.UseMiddleware<ExceptionMiddleware>();
app.MapHub<MessageProvider>("/message/hub");


app.MapGet("/chats/buscar-chats/{id}", [Authorize] async (string id, IMediator mediator) =>
{
    try
    {
        var query = new BuscarChatsCommand(id);
        var result = await mediator.Send(query);
        return Results.Ok(result);
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
});

app.MapPost("/chats/criar-chat", [Authorize]  async (CriarChatCommand command, IMediator mediator) => {
    try
    {
        var result = await mediator.Send(command);
        return Results.Ok(result);
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
});

app.MapDelete("/chats/deletar-chat/{id}",  [Authorize] async (string id, IMediator mediator) =>
{
    try
    {
        var command = new DeletarChatCommand{ ChatId = id }; 
        await mediator.Send(command);
        return Results.Ok();
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
});

app.MapGet("/chats/buscar-mensagens/{id}", [Authorize] async (string id, IMediator mediator) =>
{
    try
    {
        var command = new BuscarMensagensCommand(id);
        var result = await mediator.Send(command);
        return Results.Ok(result);
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
});

app.Run();

