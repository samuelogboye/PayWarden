using PayWarden.Domain.Common;

namespace PayWarden.Domain.Entities;

public class User : BaseEntity
{
    public string GoogleId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? ProfilePictureUrl { get; set; }

    // Navigation properties
    public Wallet? Wallet { get; set; }
    public ICollection<ApiKey> ApiKeys { get; set; } = new List<ApiKey>();
}
