namespace PayWarden.Application.Common.Constants;

public static class Permissions
{
    public const string Deposit = "deposit";
    public const string Transfer = "transfer";
    public const string Read = "read";

    public static readonly string[] All = { Deposit, Transfer, Read };

    public static bool IsValid(string permission)
    {
        return All.Contains(permission, StringComparer.OrdinalIgnoreCase);
    }
}
