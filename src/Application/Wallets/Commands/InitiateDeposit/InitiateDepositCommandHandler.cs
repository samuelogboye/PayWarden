using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PayWarden.Application.Common.Interfaces;
using PayWarden.Domain.Entities;
using PayWarden.Domain.Enums;

namespace PayWarden.Application.Wallets.Commands.InitiateDeposit;

public class InitiateDepositCommandHandler : IRequestHandler<InitiateDepositCommand, DepositInitializationResult>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly IPaystackService _paystackService;
    private readonly ILogger<InitiateDepositCommandHandler> _logger;

    public InitiateDepositCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService,
        IPaystackService paystackService,
        ILogger<InitiateDepositCommandHandler> logger)
    {
        _context = context;
        _currentUserService = currentUserService;
        _paystackService = paystackService;
        _logger = logger;
    }

    public async Task<DepositInitializationResult> Handle(InitiateDepositCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId ?? throw new UnauthorizedAccessException("User is not authenticated");

        // Get user and wallet
        var user = await _context.Users
            .Include(u => u.Wallet)
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);

        if (user == null || user.Wallet == null)
        {
            throw new InvalidOperationException("User or wallet not found");
        }

        // Generate unique reference
        var reference = $"DEP_{Guid.NewGuid():N}";

        // Create pending transaction
        var transaction = new Transaction
        {
            Id = Guid.NewGuid(),
            Reference = reference,
            Type = TransactionType.Deposit,
            Amount = request.Amount,
            WalletId = user.Wallet.Id,
            Status = TransactionStatus.Pending,
            Description = "Deposit via Paystack",
            CreatedAt = DateTime.UtcNow
        };

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync(cancellationToken);

        // Initialize Paystack transaction
        try
        {
            var paystackResponse = await _paystackService.InitializeTransactionAsync(
                request.Amount,
                user.Email,
                reference);

            if (!paystackResponse.Status || paystackResponse.Data == null)
            {
                _logger.LogError("Paystack initialization failed: {Message}", paystackResponse.Message);
                throw new InvalidOperationException($"Failed to initialize payment: {paystackResponse.Message}");
            }

            // Update transaction with Paystack reference
            transaction.PaystackReference = paystackResponse.Data.Reference;
            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Deposit initialized: Reference {Reference}, Amount {Amount}, User {UserId}",
                reference, request.Amount, userId);

            return new DepositInitializationResult
            {
                AuthorizationUrl = paystackResponse.Data.AuthorizationUrl,
                Reference = reference,
                AccessCode = paystackResponse.Data.AccessCode,
                Amount = request.Amount
            };
        }
        catch (Exception ex)
        {
            // Mark transaction as failed
            transaction.Status = TransactionStatus.Failed;
            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogError(ex, "Error initializing deposit for user {UserId}", userId);
            throw;
        }
    }
}
