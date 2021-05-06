using System;

namespace Scaffolding.Entity.Entities.Users
{
    public class UserRole : IIdentifiable
    {
        public Guid Id { get; set; }

        public int RoleId { get; set; }
        public Guid UserId { get; set; }
        public string GetId()
        {
            return Id.ToString();
        }
    }
}