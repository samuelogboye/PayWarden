using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PayWarden.Application.Wallets.Queries.GetWalletBalance;
using PayWarden.Application.Wallets.Queries.GetWalletTransactions;
using PayWarden.WebAPI.Authorization;

namespace PayWarden.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WalletController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<WalletController> _logger;

    public WalletController(IMediator mediator, ILogger<WalletController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Get current wallet balance
    /// </summary>
    [HttpGet("balance")]
    [RequirePermission("read")]
    [ProducesResponseType(typeof(WalletBalanceDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetBalance()
    {
        try
        {
            var query = new GetWalletBalanceQuery();
            var result = await _mediator.Send(query);

            _logger.LogInformation("Wallet balance retrieved for wallet {WalletId}", result.WalletId);

            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Wallet not found for user");
            return NotFound(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized attempt to get balance");
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving wallet balance");
            return StatusCode(500, new { message = "An error occurred while retrieving wallet balance" });
        }
    }

    /// <summary>
    /// Get wallet transaction history with pagination
    /// </summary>
    [HttpGet("transactions")]
    [RequirePermission("read")]
    [ProducesResponseType(typeof(TransactionListDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetTransactions([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 20)
    {
        try
        {
            // Validate pagination parameters
            if (pageNumber < 1)
            {
                return BadRequest(new { message = "Page number must be greater than 0" });
            }

            if (pageSize < 1 || pageSize > 100)
            {
                return BadRequest(new { message = "Page size must be between 1 and 100" });
            }

            var query = new GetWalletTransactionsQuery(pageNumber, pageSize);
            var result = await _mediator.Send(query);

            _logger.LogInformation("Retrieved {Count} transactions (page {PageNumber})",
                result.Transactions.Count, pageNumber);

            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Wallet not found for user");
            return NotFound(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized attempt to get transactions");
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving wallet transactions");
            return StatusCode(500, new { message = "An error occurred while retrieving transactions" });
        }
    }
}
