using Scaffolding.Entity.Entities.Users;

namespace Scaffolding.Entity.Login
{
    public class UserInfo
    {
        public UserInfo(User user, UserRole[] userRole)
        {
            User = user;
            UserRole = userRole;
        }

        public User User { get; }
        public UserRole[] UserRole { get; }
        
    }
}