namespace PayWarden.Application.Common.Constants;

public static class ExpiryDurations
{
    public const string OneHour = "1H";
    public const string OneDay = "1D";
    public const string OneMonth = "1M";
    public const string OneYear = "1Y";

    public static readonly string[] Valid = { OneHour, OneDay, OneMonth, OneYear };

    public static bool IsValid(string duration)
    {
        return Valid.Contains(duration, StringComparer.OrdinalIgnoreCase);
    }
}
