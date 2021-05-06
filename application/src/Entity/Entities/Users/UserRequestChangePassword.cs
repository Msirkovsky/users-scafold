using System;
using Scaffolding.Entity.EF;

namespace Scaffolding.Entity.Entities.Users
{
    public class UserRequestChangePassword : IExcludeHistory
    {
        
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public DateTime DtCreate { get; set; }
        public bool IsUsed { get; set; }
    }
}