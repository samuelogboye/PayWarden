using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PayWarden.Domain.Entities;

namespace PayWarden.Infrastructure.Persistence.Configurations;

public class TransactionConfiguration : IEntityTypeConfiguration<Transaction>
{
    public void Configure(EntityTypeBuilder<Transaction> builder)
    {
        builder.HasKey(t => t.Id);

        builder.Property(t => t.Reference)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasIndex(t => t.Reference)
            .IsUnique();

        builder.Property(t => t.Type)
            .IsRequired();

        builder.Property(t => t.Amount)
            .HasPrecision(18, 4)
            .IsRequired();

        builder.Property(t => t.WalletId)
            .IsRequired();

        builder.Property(t => t.Status)
            .IsRequired();

        builder.Property(t => t.Description)
            .HasMaxLength(500);

        builder.Property(t => t.PaystackReference)
            .HasMaxLength(100);

        builder.HasIndex(t => t.PaystackReference);
        builder.HasIndex(t => t.WalletId);
        builder.HasIndex(t => t.CreatedAt);
    }
}
