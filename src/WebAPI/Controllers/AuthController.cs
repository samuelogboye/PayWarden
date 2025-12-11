using MediatR;
using Microsoft.AspNetCore.Mvc;
using PayWarden.Application.Auth.Commands;

namespace PayWarden.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IMediator mediator, ILogger<AuthController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Authenticate with Google OAuth and receive a JWT token
    /// </summary>
    /// <param name="request">Google OAuth token from client</param>
    /// <returns>JWT token and user information</returns>
    [HttpPost("google")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
    {
        try
        {
            var command = new GoogleLoginCommand(request.GoogleToken);
            var result = await _mediator.Send(command);

            _logger.LogInformation("User {UserId} logged in successfully via Google", result.UserId);

            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Invalid Google token provided");
            return Unauthorized(new { message = "Invalid Google token" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during Google authentication");
            return StatusCode(500, new { message = "An error occurred during authentication" });
        }
    }
}

public record GoogleLoginRequest(string GoogleToken);
