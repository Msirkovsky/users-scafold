using System;
using System.IO;
using System.Reflection;
using API.Config;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using My.Shared.Utils;
using Serilog;
using Serilog.Events;

namespace API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            WriteLogo();

            var path= Path.Combine($"{CoreDirectory.GetEntryAssemblyPath()}", "logs", "main.log");

            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Debug()
                .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
                .Enrich.FromLogContext()
                .WriteTo.File(path, rollingInterval: RollingInterval.Day, retainedFileCountLimit:31)
                .CreateLogger();

            Log.Information("test");

            WriteLog("starting TODO");

            BuildWebHost(args).Run();
        }

        
        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
              
                .ConfigureAppConfiguration((hostContext, config) =>
                {
                    // delete all default configuration providers
                    config.Sources.Clear();
                    config.AddJsonFile("myconfig.json", optional: true);
                    config.AddJsonFile(Configurations.GetConfigFileName(), true);
                })
               
                .Build();


        private static void WriteLogo()
        {
            Console.Title = "TODO";

            Console.WriteLine();
            Console.WriteLine("      #########################################");
            Console.WriteLine("      #                                       #");
            Console.WriteLine("      #   TODO   1.0                      #");
            Console.WriteLine("      #                                       #");
            Console.WriteLine("      #########################################");
            Console.WriteLine();
            Console.WriteLine($"      {DateTime.Now:f} | {GetCurrentVersion()}");
            Console.WriteLine();
        }

        private static void WriteLog(string log)
        {
            Console.WriteLine($"[*] {log}");
            Console.WriteLine();
        }

        private static string GetCurrentVersion()
        {
            return Assembly.GetEntryAssembly()?.GetName().Version.ToString();
        }
    }
}
