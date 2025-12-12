using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using PayWarden.Application.Common.Interfaces;

namespace PayWarden.WebAPI.Authorization;

[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class)]
public class RequirePermissionAttribute : Attribute, IAuthorizationFilter
{
    private readonly string _permission;

    public RequirePermissionAttribute(string permission)
    {
        _permission = permission;
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var apiKeyContext = context.HttpContext.RequestServices.GetService<IApiKeyContext>();
        var currentUserService = context.HttpContext.RequestServices.GetService<ICurrentUserService>();

        // If authenticated via JWT, allow all operations (full access)
        if (currentUserService?.IsAuthenticated == true && apiKeyContext?.ApiKeyId == null)
        {
            return;
        }

        // If authenticated via API key, check permissions
        if (apiKeyContext?.IsAuthenticated == true && apiKeyContext.HasPermission(_permission))
        {
            return;
        }

        // Not authorized
        context.Result = new ObjectResult(new { message = $"Permission '{_permission}' is required for this operation" })
        {
            StatusCode = 403
        };
    }
}
