using PayWarden.Domain.Common;

namespace PayWarden.Domain.Entities;

public class ApiKey : BaseEntity
{
    public string KeyHash { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string[] Permissions { get; set; } = Array.Empty<string>();
    public DateTime ExpiresAt { get; set; }
    public bool IsActive { get; set; } = true;
    public Guid UserId { get; set; }
    public DateTime? LastUsedAt { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;

    public bool HasExpired => DateTime.UtcNow > ExpiresAt;
    public bool HasPermission(string permission) => Permissions.Contains(permission, StringComparer.OrdinalIgnoreCase);
}
