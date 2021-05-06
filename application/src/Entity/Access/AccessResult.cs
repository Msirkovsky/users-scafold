using System.Security;

namespace Scaffolding.Entity.Access
{
    public static class BoolExtensions
    {
        public static void OrThrowSecurityException(this bool val)
        {
            if (val == false)
                throw new SecurityException();
        }

        public static void OrThrowSecurityException(this AccessResult val)
        {
            if (val.Ok == false)
                throw new SecurityException();
        }

        public static AccessResult ToAccessResult(this bool val)
        {
            return val ? AccessResult.True() : AccessResult.False("");
        }

        public static AccessResult ToAccessResult(this bool val, string error)
        {
            return val ? AccessResult.True() : AccessResult.False(error);
        }
    }

    public class AccessResult
    {
        private AccessResult(bool ok, string message)
        {
            Ok = ok;
            Message = message;
        }

        public static AccessResult True()
        {
            return new AccessResult(true, "");
        }

        public static AccessResult False(string message)
        {
            return new AccessResult(false, message);
        }

        public bool Ok { get; }
        public string Message { get; }

        public static AccessResult FromBool(bool val, string message)
        {
            return val ? True() : False(message);
        }
    }
}