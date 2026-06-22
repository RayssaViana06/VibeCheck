using auth_service.Settings;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace auth_service.Attributes
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class RequireInternalApiKeyAttribute : Attribute, IAsyncActionFilter
    {
        private const string HeaderName = "X-Internal-Key";

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var settings = context.HttpContext.RequestServices.GetRequiredService<InternalApiSettings>();

            if (!context.HttpContext.Request.Headers.TryGetValue(HeaderName, out var providedKey))
            {
                context.Result = new UnauthorizedObjectResult(new { message = "Chave interna não informada." });
                return;
            }

            if (providedKey != settings.ApiKey)
            {
                context.Result = new UnauthorizedObjectResult(new { message = "Chave interna inválida." });
                return;
            }

            await next();
        }
    }
}