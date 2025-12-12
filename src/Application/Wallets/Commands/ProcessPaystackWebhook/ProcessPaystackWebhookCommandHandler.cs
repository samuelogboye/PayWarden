using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PayWarden.Application.Common.Interfaces;
using PayWarden.Domain.Enums;

namespace PayWarden.Application.Wallets.Commands.ProcessPaystackWebhook;

public class ProcessPaystackWebhookCommandHandler : IRequestHandler<ProcessPaystackWebhookCommand, Unit>
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<ProcessPaystackWebhookCommandHandler> _logger;

    public ProcessPaystackWebhookCommandHandler(
        IApplicationDbContext context,
        ILogger<ProcessPaystackWebhookCommandHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Unit> Handle(ProcessPaystackWebhookCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Processing Paystack webhook: Event {Event}, Reference {Reference}",
            request.Event, request.Data.Reference);

        // Only process charge.success events
        if (request.Event != "charge.success")
        {
            _logger.LogInformation("Ignoring non-charge.success event: {Event}", request.Event);
            return Unit.Value;
        }

        // Verify event data status is success
        if (request.Data.Status != "success")
        {
            _logger.LogWarning("Charge event with non-success status: {Status}", request.Data.Status);
            return Unit.Value;
        }

        // Find transaction by reference
        var transaction = await _context.Transactions
            .Include(t => t.Wallet)
            .FirstOrDefaultAsync(t => t.Reference == request.Data.Reference, cancellationToken);

        if (transaction == null)
        {
            _logger.LogWarning("Transaction not found for reference: {Reference}", request.Data.Reference);
            return Unit.Value;
        }

        // Idempotency check - only process if transaction is still pending
        if (transaction.Status != TransactionStatus.Pending)
        {
            _logger.LogInformation("Transaction already processed: {Reference}, Status {Status}",
                request.Data.Reference, transaction.Status);
            return Unit.Value;
        }

        // Use database transaction for atomic operation
        using var dbTransaction = await _context.Database.BeginTransactionAsync(cancellationToken);
        try
        {
            // Update transaction status
            transaction.Status = TransactionStatus.Success;
            transaction.UpdatedAt = DateTime.UtcNow;

            // Credit wallet balance
            transaction.Wallet.Balance += transaction.Amount;
            transaction.Wallet.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);
            await dbTransaction.CommitAsync(cancellationToken);

            _logger.LogInformation("Wallet credited successfully: Reference {Reference}, Amount {Amount}, Wallet {WalletId}",
                request.Data.Reference, transaction.Amount, transaction.WalletId);
        }
        catch (Exception ex)
        {
            await dbTransaction.RollbackAsync(cancellationToken);
            _logger.LogError(ex, "Error processing webhook for reference {Reference}", request.Data.Reference);
            throw;
        }

        return Unit.Value;
    }
}
