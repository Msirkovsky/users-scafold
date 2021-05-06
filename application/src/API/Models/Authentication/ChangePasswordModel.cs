namespace API.Models.Authentication
{
    public class ChangePasswordModel
    {
        public ChangePasswordModel(string email)
        {
            Email = email;
        }

        public string Email { get; set; }

    }
}