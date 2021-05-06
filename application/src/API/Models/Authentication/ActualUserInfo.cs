namespace API.Models.Authentication
{
    public class ActualUserInfo
    {
        public ActualUserInfo(string fullName, string email)
        {
            FullName = fullName;
            Email = email;
        }

        public string FullName { get; set; }
        public string Email { get; set; }
    }
}