using Scaffolding.Entity.Entities.Users;

namespace API.Models.Users
{
    public class DetailUserDatasource
    {
        public bool CanEdit { get; set; }        
        public Role[] Roles { get; set; }
    }
}