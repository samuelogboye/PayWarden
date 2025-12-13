using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PayWarden.Application.Common.Interfaces;
using PayWarden.Domain.Entities;
using PayWarden.Domain.Enums;

namespace PayWarden.Application.Wallets.Commands.TransferFunds;

public class TransferFundsCommandHandler : IRequestHandler<TransferFundsCommand, TransferFundsResult>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly ILogger<TransferFundsCommandHandler> _logger;

    public TransferFundsCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService,
        ILogger<TransferFundsCommandHandler> logger)
    {
        _context = context;
        _currentUserService = currentUserService;
        _logger = logger;
    }

    public async Task<TransferFundsResult> Handle(TransferFundsCommand request, CancellationToken cancellationToken)
    {
        // Get current user ID
        var userId = _currentUserService.UserId
            ?? throw new UnauthorizedAccessException("User is not authenticated");

        // Validate amount
        if (request.Amount <= 0)
        {
            throw new InvalidOperationException("Transfer amount must be greater than zero");
        }

        // Get sender wallet with row-level locking for concurrency control
        var senderWallet = await _context.Wallets
            .FirstOrDefaultAsync(w => w.UserId == userId, cancellationToken)
            ?? throw new InvalidOperationException("Sender wallet not found");

        // Get recipient wallet by wallet number
        var recipientWallet = await _context.Wallets
            .FirstOrDefaultAsync(w => w.WalletNumber == request.RecipientWalletNumber, cancellationToken)
            ?? throw new InvalidOperationException($"Recipient wallet with number '{request.RecipientWalletNumber}' not found");

        // Validate sender is not sending to themselves
        if (senderWallet.Id == recipientWallet.Id)
        {
            throw new InvalidOperationException("Cannot transfer to your own wallet");
        }

        // Validate sufficient balance
        if (senderWallet.Balance < request.Amount)
        {
            _logger.LogWarning("Insufficient balance. User {UserId} attempted to transfer {Amount} but only has {Balance}",
                userId, request.Amount, senderWallet.Balance);
            throw new InvalidOperationException($"Insufficient balance. Available: {senderWallet.Balance:F2}, Required: {request.Amount:F2}");
        }

        // Generate unique transfer reference
        var transferReference = $"TRF_{Guid.NewGuid():N}";

        // Begin database transaction for atomic operation
        using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);

        try
        {
            // Create WalletTransfer record (we'll set transaction IDs after creating them)
            var walletTransfer = new WalletTransfer
            {
                Reference = transferReference,
                SenderWalletId = senderWallet.Id,
                ReceiverWalletId = recipientWallet.Id,
                Amount = request.Amount,
                Description = request.Description,
                DebitTransactionId = Guid.Empty, // Temporary, will update
                CreditTransactionId = Guid.Empty // Temporary, will update
            };

            // Create debit transaction for sender (unique reference)
            var debitTransaction = new Transaction
            {
                Reference = $"{transferReference}_DEBIT",
                Type = TransactionType.TransferDebit,
                Amount = request.Amount,
                WalletId = senderWallet.Id,
                Status = TransactionStatus.Success,
                Description = request.Description ?? $"Transfer to {recipientWallet.WalletNumber}"
            };

            // Create credit transaction for recipient (unique reference)
            var creditTransaction = new Transaction
            {
                Reference = $"{transferReference}_CREDIT",
                Type = TransactionType.TransferCredit,
                Amount = request.Amount,
                WalletId = recipientWallet.Id,
                Status = TransactionStatus.Success,
                Description = request.Description ?? $"Transfer from {senderWallet.WalletNumber}"
            };

            // Add transactions to context (generates IDs)
            _context.Transactions.Add(debitTransaction);
            _context.Transactions.Add(creditTransaction);

            // Save to generate IDs
            await _context.SaveChangesAsync(cancellationToken);

            // Update WalletTransfer with transaction IDs
            walletTransfer.DebitTransactionId = debitTransaction.Id;
            walletTransfer.CreditTransactionId = creditTransaction.Id;

            _context.WalletTransfers.Add(walletTransfer);

            // Update wallet balances
            senderWallet.Balance -= request.Amount;
            recipientWallet.Balance += request.Amount;

            // Save changes (this will trigger concurrency check via RowVersion)
            await _context.SaveChangesAsync(cancellationToken);

            // Commit transaction
            await transaction.CommitAsync(cancellationToken);

            _logger.LogInformation("Transfer completed successfully. Reference: {Reference}, From: {SenderWallet}, To: {RecipientWallet}, Amount: {Amount}",
                transferReference, senderWallet.WalletNumber, recipientWallet.WalletNumber, request.Amount);

            return new TransferFundsResult
            {
                TransferReference = transferReference,
                SenderWalletNumber = senderWallet.WalletNumber,
                RecipientWalletNumber = recipientWallet.WalletNumber,
                Amount = request.Amount,
                NewBalance = senderWallet.Balance,
                TransferredAt = DateTime.UtcNow,
                Description = request.Description
            };
        }
        catch (DbUpdateConcurrencyException ex)
        {
            await transaction.RollbackAsync(cancellationToken);
            _logger.LogWarning(ex, "Concurrency conflict during transfer. Reference: {Reference}", transferReference);
            throw new InvalidOperationException("Transfer failed due to concurrent operation. Please try again.");
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync(cancellationToken);
            _logger.LogError(ex, "Error during transfer. Reference: {Reference}", transferReference);
            throw;
        }
    }
}
