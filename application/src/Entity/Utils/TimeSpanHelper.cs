using System;

namespace Scaffolding.Entity.Utils
{
    public static class TimeSpanHelper
    {
        public static TimeSpan? ParseSafe(string val)
        {
            if (string.IsNullOrWhiteSpace(val))
                return null;
            return TimeSpan.Parse(val);
        }
    }
}