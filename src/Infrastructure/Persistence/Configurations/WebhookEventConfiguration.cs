using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PayWarden.Domain.Entities;

namespace PayWarden.Infrastructure.Persistence.Configurations;

public class WebhookEventConfiguration : IEntityTypeConfiguration<WebhookEvent>
{
    public void Configure(EntityTypeBuilder<WebhookEvent> builder)
    {
        builder.HasKey(we => we.Id);

        builder.Property(we => we.EventType)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(we => we.Payload)
            .IsRequired();

        builder.Property(we => we.PaystackSignature)
            .HasMaxLength(500);

        builder.Property(we => we.IsProcessed)
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(we => we.ProcessingError)
            .HasMaxLength(1000);

        builder.HasIndex(we => we.IsProcessed);
        builder.HasIndex(we => we.CreatedAt);
    }
}
