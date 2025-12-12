using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PayWarden.Application.Common.Interfaces;

namespace PayWarden.Application.Wallets.Queries.GetDepositStatus;

public class GetDepositStatusQueryHandler : IRequestHandler<GetDepositStatusQuery, DepositStatusDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly IPaystackService _paystackService;
    private readonly ILogger<GetDepositStatusQueryHandler> _logger;

    public GetDepositStatusQueryHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService,
        IPaystackService paystackService,
        ILogger<GetDepositStatusQueryHandler> logger)
    {
        _context = context;
        _currentUserService = currentUserService;
        _paystackService = paystackService;
        _logger = logger;
    }

    public async Task<DepositStatusDto> Handle(GetDepositStatusQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId ?? throw new UnauthorizedAccessException("User is not authenticated");

        // Get transaction
        var transaction = await _context.Transactions
            .Include(t => t.Wallet)
            .FirstOrDefaultAsync(t => t.Reference == request.Reference, cancellationToken);

        if (transaction == null)
        {
            throw new InvalidOperationException("Transaction not found");
        }

        // Verify user owns this transaction
        if (transaction.Wallet.UserId != userId)
        {
            throw new UnauthorizedAccessException("You do not have access to this transaction");
        }

        // Get Paystack status (manual verification - DOES NOT credit wallet)
        string paystackStatus = "unknown";
        try
        {
            var verifyResponse = await _paystackService.VerifyTransactionAsync(request.Reference);
            if (verifyResponse.Status && verifyResponse.Data != null)
            {
                paystackStatus = verifyResponse.Data.Status;
            }

            _logger.LogInformation("Deposit status checked: Reference {Reference}, Status {Status}, Paystack {PaystackStatus}",
                request.Reference, transaction.Status, paystackStatus);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to verify transaction with Paystack: {Reference}", request.Reference);
            // Continue - we still return our local transaction status
        }

        return new DepositStatusDto
        {
            Reference = transaction.Reference,
            Amount = transaction.Amount,
            Status = transaction.Status.ToString(),
            PaystackStatus = paystackStatus,
            CreatedAt = transaction.CreatedAt
        };
    }
}
