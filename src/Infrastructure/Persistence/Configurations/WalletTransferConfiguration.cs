using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PayWarden.Domain.Entities;

namespace PayWarden.Infrastructure.Persistence.Configurations;

public class WalletTransferConfiguration : IEntityTypeConfiguration<WalletTransfer>
{
    public void Configure(EntityTypeBuilder<WalletTransfer> builder)
    {
        builder.HasKey(wt => wt.Id);

        builder.Property(wt => wt.Reference)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasIndex(wt => wt.Reference)
            .IsUnique();

        builder.Property(wt => wt.Amount)
            .HasPrecision(18, 4)
            .IsRequired();

        builder.Property(wt => wt.Description)
            .HasMaxLength(500);

        // Relationships
        builder.HasOne(wt => wt.SenderWallet)
            .WithMany()
            .HasForeignKey(wt => wt.SenderWalletId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(wt => wt.ReceiverWallet)
            .WithMany()
            .HasForeignKey(wt => wt.ReceiverWalletId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(wt => wt.DebitTransaction)
            .WithOne()
            .HasForeignKey<WalletTransfer>(wt => wt.DebitTransactionId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(wt => wt.CreditTransaction)
            .WithOne()
            .HasForeignKey<WalletTransfer>(wt => wt.CreditTransactionId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(wt => wt.SenderWalletId);
        builder.HasIndex(wt => wt.ReceiverWalletId);
    }
}
