using PayWarden.Application.Common.Constants;

namespace PayWarden.Application.Common.Services;

public static class ExpiryDurationParser
{
    public static DateTime ParseToDateTime(string duration)
    {
        var upperDuration = duration.ToUpperInvariant();

        return upperDuration switch
        {
            ExpiryDurations.OneHour => DateTime.UtcNow.AddHours(1),
            ExpiryDurations.OneDay => DateTime.UtcNow.AddDays(1),
            ExpiryDurations.OneMonth => DateTime.UtcNow.AddDays(30),
            ExpiryDurations.OneYear => DateTime.UtcNow.AddDays(365),
            _ => throw new ArgumentException($"Invalid expiry duration: {duration}. Valid values are: 1H, 1D, 1M, 1Y", nameof(duration))
        };
    }
}
