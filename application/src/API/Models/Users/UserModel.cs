using System;

namespace API.Models.Users
{
    public class UserModel
    {
        public Guid? Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Telephone { get; set; }
        public bool IsActive { get; set; }
        public string LastLoginDateStr { get; set; }
        public string Position { get; set; }
        public string Company { get; set; }

        public int[] Roles { get; set; }
    }
}