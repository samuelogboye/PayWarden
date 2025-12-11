using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PayWarden.Domain.Entities;

namespace PayWarden.Infrastructure.Persistence.Configurations;

public class ApiKeyConfiguration : IEntityTypeConfiguration<ApiKey>
{
    public void Configure(EntityTypeBuilder<ApiKey> builder)
    {
        builder.HasKey(a => a.Id);

        builder.Property(a => a.KeyHash)
            .IsRequired()
            .HasMaxLength(500);

        builder.HasIndex(a => a.KeyHash)
            .IsUnique();

        builder.Property(a => a.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(a => a.Permissions)
            .IsRequired();

        builder.Property(a => a.ExpiresAt)
            .IsRequired();

        builder.Property(a => a.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(a => a.UserId)
            .IsRequired();

        builder.HasIndex(a => a.UserId);
        builder.HasIndex(a => a.ExpiresAt);
    }
}
