namespace Scaffolding.Entity.Utils
{
    public static class IntHelper
    {
        public static int? ParseSafe(string val)
        {
            if (string.IsNullOrWhiteSpace(val))
                return null;
            return int.Parse(val);
        }

    }
}