using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PayWarden.Application.ApiKeys.Commands.CreateApiKey;
using PayWarden.Application.ApiKeys.Commands.RolloverApiKey;

namespace PayWarden.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class KeysController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<KeysController> _logger;

    public KeysController(IMediator mediator, ILogger<KeysController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Create a new API key with specified permissions
    /// </summary>
    [HttpPost("create")]
    [ProducesResponseType(typeof(CreateApiKeyResult), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> CreateApiKey([FromBody] CreateApiKeyRequest request)
    {
        try
        {
            var command = new CreateApiKeyCommand(
                request.Name,
                request.Permissions,
                request.ExpiryDuration
            );

            var result = await _mediator.Send(command);

            _logger.LogInformation("API key {KeyId} created successfully", result.KeyId);

            return CreatedAtAction(nameof(CreateApiKey), new { id = result.KeyId }, result);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Failed to create API key");
            return BadRequest(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized attempt to create API key");
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating API key");
            return StatusCode(500, new { message = "An error occurred while creating the API key" });
        }
    }

    /// <summary>
    /// Rollover an expired API key with the same permissions
    /// </summary>
    [HttpPost("rollover")]
    [ProducesResponseType(typeof(CreateApiKeyResult), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> RolloverApiKey([FromBody] RolloverApiKeyRequest request)
    {
        try
        {
            var command = new RolloverApiKeyCommand(
                request.OldKeyId,
                request.ExpiryDuration
            );

            var result = await _mediator.Send(command);

            _logger.LogInformation("API key {OldKeyId} rolled over to {NewKeyId}", request.OldKeyId, result.KeyId);

            return CreatedAtAction(nameof(RolloverApiKey), new { id = result.KeyId }, result);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Failed to rollover API key");
            return BadRequest(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized attempt to rollover API key");
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error rolling over API key");
            return StatusCode(500, new { message = "An error occurred while rolling over the API key" });
        }
    }
}

public record CreateApiKeyRequest(
    string Name,
    string[] Permissions,
    string ExpiryDuration
);

public record RolloverApiKeyRequest(
    Guid OldKeyId,
    string ExpiryDuration
);
