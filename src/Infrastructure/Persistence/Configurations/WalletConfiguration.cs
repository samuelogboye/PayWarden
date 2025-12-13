using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PayWarden.Domain.Entities;

namespace PayWarden.Infrastructure.Persistence.Configurations;

public class WalletConfiguration : IEntityTypeConfiguration<Wallet>
{
    public void Configure(EntityTypeBuilder<Wallet> builder)
    {
        builder.HasKey(w => w.Id);

        builder.Property(w => w.WalletNumber)
            .IsRequired()
            .HasMaxLength(20);

        builder.HasIndex(w => w.WalletNumber)
            .IsUnique();

        builder.Property(w => w.Balance)
            .HasPrecision(18, 4) // 18 digits total, 4 decimal places
            .IsRequired();

        builder.Property(w => w.UserId)
            .IsRequired();

        // Concurrency token using PostgreSQL's xmin system column
        builder.Property(w => w.Version)
            .IsRowVersion()
            .HasColumnName("xmin")
            .HasColumnType("xid")
            .ValueGeneratedOnAddOrUpdate();

        // One-to-many relationship with Transactions
        builder.HasMany(w => w.Transactions)
            .WithOne(t => t.Wallet)
            .HasForeignKey(t => t.WalletId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
