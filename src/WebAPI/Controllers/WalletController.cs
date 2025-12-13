using System.Text;
using System.Text.Json;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PayWarden.Application.Wallets.Commands.InitiateDeposit;
using PayWarden.Application.Wallets.Commands.ProcessPaystackWebhook;
using PayWarden.Application.Wallets.Commands.TransferFunds;
using PayWarden.Application.Wallets.Queries.GetDepositStatus;
using PayWarden.Application.Wallets.Queries.GetWalletBalance;
using PayWarden.Application.Wallets.Queries.GetWalletTransactions;
using PayWarden.Application.Wallets.Queries.ResolveWalletNumber;
using PayWarden.Infrastructure.Services;
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
    /// Resolve wallet number to account name
    /// </summary>
    [HttpGet("resolve/{walletNumber}")]
    [ProducesResponseType(typeof(ResolveWalletNumberResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> ResolveWalletNumber(string walletNumber)
    {
        try
        {
            var query = new ResolveWalletNumberQuery { WalletNumber = walletNumber };
            var result = await _mediator.Send(query);

            _logger.LogInformation("Wallet number resolved: {WalletNumber} -> {AccountName}",
                walletNumber, result.AccountName);

            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Wallet not found: {WalletNumber}", walletNumber);
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error resolving wallet number");
            return StatusCode(500, new { message = "An error occurred while resolving wallet number" });
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

    /// <summary>
    /// Initiate a deposit via Paystack
    /// </summary>
    [HttpPost("deposit")]
    [RequirePermission("deposit")]
    [ProducesResponseType(typeof(DepositInitializationResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> InitiateDeposit([FromBody] InitiateDepositRequest request)
    {
        var command = new InitiateDepositCommand(request.Amount);
        var result = await _mediator.Send(command);

        _logger.LogInformation("Deposit initiated: Reference {Reference}, Amount {Amount}",
            result.Reference, result.Amount);

        return Ok(result);
    }

    /// <summary>
    /// Get deposit status (manual verification - does not credit wallet)
    /// </summary>
    [HttpGet("deposit/{reference}/status")]
    [RequirePermission("read")]
    [ProducesResponseType(typeof(DepositStatusDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetDepositStatus(string reference)
    {
        var query = new GetDepositStatusQuery(reference);
        var result = await _mediator.Send(query);

        return Ok(result);
    }

    /// <summary>
    /// Transfer funds to another wallet
    /// </summary>
    [HttpPost("transfer")]
    [RequirePermission("transfer")]
    [ProducesResponseType(typeof(TransferFundsResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Transfer([FromBody] TransferFundsRequest request)
    {
        var command = new TransferFundsCommand(
                request.RecipientWalletNumber,
                request.Amount,
                request.Description);

        var result = await _mediator.Send(command);

        _logger.LogInformation("Transfer successful: Reference {Reference}, Amount {Amount}, To {RecipientWallet}",
            result.TransferReference, result.Amount, result.RecipientWalletNumber);

        return Ok(result);
    }

    /// <summary>
    /// Paystack webhook endpoint for payment notifications
    /// </summary>
    [HttpPost("paystack/webhook")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> PaystackWebhook([FromServices] IPaystackWebhookValidator webhookValidator)
    {
        try
        {
            // Read raw body
            using var reader = new StreamReader(Request.Body, Encoding.UTF8);
            var payload = await reader.ReadToEndAsync();

            // Validate signature
            var signature = Request.Headers["x-paystack-signature"].ToString();
            if (string.IsNullOrEmpty(signature))
            {
                _logger.LogWarning("Webhook received without signature");
                return BadRequest(new { message = "Missing signature" });
            }

            if (!webhookValidator.ValidateSignature(payload, signature))
            {
                _logger.LogWarning("Invalid webhook signature");
                return BadRequest(new { message = "Invalid signature" });
            }

            // Log raw payload for audit
            _logger.LogInformation("Paystack webhook received: {Payload}", payload);

            // Parse webhook data
            var webhookData = JsonSerializer.Deserialize<PaystackWebhookPayload>(payload,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (webhookData == null)
            {
                _logger.LogWarning("Failed to deserialize webhook payload");
                return BadRequest(new { message = "Invalid payload" });
            }

            // Process webhook
            var command = new ProcessPaystackWebhookCommand(
                webhookData.Event,
                new PaystackWebhookData
                {
                    Reference = webhookData.Data?.Reference ?? string.Empty,
                    Status = webhookData.Data?.Status ?? string.Empty,
                    Amount = webhookData.Data?.Amount ?? 0,
                    Customer = webhookData.Data?.Customer?.Email ?? string.Empty
                });

            await _mediator.Send(command);

            return Ok(new { message = "Webhook processed successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing Paystack webhook");
            return StatusCode(500, new { message = "An error occurred while processing webhook" });
        }
    }
}

public record InitiateDepositRequest(decimal Amount);

public record TransferFundsRequest(
    string RecipientWalletNumber,
    decimal Amount,
    string? Description = null);

// Paystack webhook payload models
public class PaystackWebhookPayload
{
    public string Event { get; set; } = string.Empty;
    public PaystackEventData? Data { get; set; }
}

public class PaystackEventData
{
    public string Reference { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public long Amount { get; set; }
    public PaystackCustomer? Customer { get; set; }
}

public class PaystackCustomer
{
    public string Email { get; set; } = string.Empty;
}
