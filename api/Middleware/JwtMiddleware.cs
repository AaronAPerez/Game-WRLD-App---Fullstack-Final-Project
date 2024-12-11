using System.Security.Claims;
using api.Services;

namespace api.Middleware;

public class JwtMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ITokenService _tokenService;
    private readonly ILogger<JwtMiddleware> _logger;

    public JwtMiddleware(
        RequestDelegate next,
        ITokenService tokenService,
        ILogger<JwtMiddleware> logger)
    {
        _next = next;
        _tokenService = tokenService;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            if (token != null && _tokenService.ValidateToken(token))
            {
                // Attach user to context if token is valid
                var principal = _tokenService.GetPrincipalFromExpiredToken(token);
                context.User = principal;
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Error processing JWT token");
        }

        await _next(context);
    }
}

public interface ITokenService
{
    ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
    bool ValidateToken(string token);
}