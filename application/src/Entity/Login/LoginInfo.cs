using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using My.Shared.Validations;

namespace Scaffolding.Entity.Login
{
    public class LoginInfo
    {

        public LoginInfo(Guid userId, string email, string passwordHash, string language)
        {
            CoreValidations.NotNull(email, nameof(email));
            CoreValidations.NotNull(passwordHash, nameof(passwordHash));

            Email = email;
            PasswordHash = passwordHash;
            Language = language;
            UserId = userId;
        }

        public Guid UserId { get; }

        public string Email { get; }

        public string PasswordHash { get; }
        public string Language { get; }

        public bool CheckPassword(string password)
        {
            var passUnderCheck = GetHash(password);
            return string.Equals(PasswordHash, passUnderCheck, StringComparison.OrdinalIgnoreCase);
        }

        public static string GetHash(string input)
        {
            var sha1 = SHA1.Create();
            return string.Join("",
                sha1.ComputeHash(Encoding.UTF8.GetBytes(input))
                    .Select(x => x.ToString("X2"))
                    .ToArray());
        }

        public static string CheckPasswordFormat(string password)
        {
            if (password.Length < 6)
                return "Heslo musí být minimálně 6 znaků dlouhé";

            return null;
        }
    }
}
