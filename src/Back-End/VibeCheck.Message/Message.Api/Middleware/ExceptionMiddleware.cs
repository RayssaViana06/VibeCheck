using Message.Domain.Exceptions;
using System.Net;
using System.Runtime.CompilerServices;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Message.Api.Middleware
{
    public class ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> log, IHostEnvironment env)
    {
        private readonly RequestDelegate _next = next;
        private readonly ILogger<ExceptionMiddleware> _log = log;
        private readonly IHostEnvironment _env = env;
        
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _log.LogError(ex, ex.Message);

                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                var response = _env.IsDevelopment()
                    ? new ApiException
                    {
                        StatusCode = context.Response.StatusCode.ToString(),
                        Message = ex.Message,
                        Datails = ex.StackTrace
                    }
                    : new ApiException
                    {
                        StatusCode = context.Response.StatusCode.ToString(),
                        Message = "Internal Server Error"
                    };
                var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

                var json = JsonSerializer.Serialize(response, options);

                await context.Response.WriteAsync(json);
            }
        }


    }
}
