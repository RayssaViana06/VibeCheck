using auth_service.Services;

namespace auth_service.Middlewares
{
    public class BlacklistMiddleware
    {
        private readonly RequestDelegate _next;

        public BlacklistMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, BlacklistService blacklistService)
        {
            var authHeader = context.Request.Headers["Authorization"].ToString();

            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
            {
                var token = authHeader.Replace("Bearer ", "");
                var isBlacklisted = await blacklistService.IsBlacklistedAsync(token);

                if (isBlacklisted)
                {
                    context.Response.StatusCode = 401;
                    await context.Response.WriteAsync("Token inválido. Faça login novamente.");
                    return;
                }
            }

            await _next(context);
        }
    }
}