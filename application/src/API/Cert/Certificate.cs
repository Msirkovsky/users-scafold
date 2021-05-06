using System;
using System.IO;
using System.Security.Cryptography.X509Certificates;
using My.Shared.Utils;

namespace API.Cert
{
    public static class Certificate
    {
        public static X509Certificate2 Load()
        {
            Console.WriteLine("Cert searching: " + GetPathToCertificate());
            return new X509Certificate2(
                GetPathToCertificate(), "XX");
        }

        public static string GetPathToCertificate()
        {
            return Path.Combine($"{CoreDirectory.GetEntryAssemblyPath()}", "Cert", "cert.pfx");
        }
    }
}
