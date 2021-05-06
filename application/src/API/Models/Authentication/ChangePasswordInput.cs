using System;

namespace API.Models.Authentication
{
    public class ChangePasswordInput
    {
        public string NewPassword { get; set; }
        public Guid UserRequestChangePasswordId { get; set; }
    }
}