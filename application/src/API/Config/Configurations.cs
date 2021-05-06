namespace API.Config
{
    public static class Configurations
    {
        public static string AppConfigFile => "appsettings";

        public static string AppConfigFileExtension => "json";

        public static string GetConfigFileName()
        {
            return $"{AppConfigFile}.{AppConfigFileExtension}";
        }

        public static string GetConfigFileName(string environment)
        {
            return $"{AppConfigFile}.{environment}.{AppConfigFileExtension}";
        }
    }
}
