using Scaffolding.Entity.EF;

namespace Scaffolding.Entity.Entities.Users
{
    public class PermissionRole : IExcludeHistory
    {
        public int Id { get; set; }
        
        public int RoleId { get; set; }
        public int PermissionId { get; set; }
    }
}