using System;

namespace API.Models.Users
{
    public class ConfirmChangePasswordInput
    {
        public Guid UserRequestChangePasswordId { get; set; }
        public string NewPassword { get; set; }
    }
}