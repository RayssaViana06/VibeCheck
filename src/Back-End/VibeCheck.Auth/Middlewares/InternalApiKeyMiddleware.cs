namespace auth_service.Middlewares
{
    public class InternalApiKeyMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly string _apiKey;

        public InternalApiKeyMiddleware(RequestDelegate next, IConfiguration configuration)
        {
            _next = next;
            _apiKey = configuration["InternalApi:ApiKey"]!;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if (context.Request.Path.StartsWithSegments("/internal"))
            {
                if (!context.Request.Headers.TryGetValue("X-Internal-Key", out var key) || key != _apiKey)
                {
                    context.Response.StatusCode = 401;
                    await context.Response.WriteAsync("Chave de API interna inválida.");
                    return;
                }
            }

            await _next(context);
        }
    }
}