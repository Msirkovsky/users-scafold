using System;
using System.ComponentModel.DataAnnotations.Schema;
using Scaffolding.Entity.EF;

namespace Scaffolding.Entity.Entities.Users
{
    public class Notifikace : IExcludeHistory
    {
        
        public const int INFO=1;
        public const int UKOL=2;

        public Guid Id { get; set; }
        public Guid UserId  { get; set; }
        public string Message  { get; set; }
        public int Typ { get; set; }
        public bool Precteno { get; set; }
    }

    [Table("Users")]
    public class User : EntityConcurrencyBase
    {
        public Guid Id { get; set; }
        
        [NotMapped]
        public string FullName => FirstName + " " + LastName;

        public string FirstName { get; set; }
        public string LastName { get; set; }
        //use email
        //public string Login { get; set; }
        public string PassHash { get; set; }
        public string Email { get; set; }
        public string Telephone { get; set; }
        public bool IsActive { get; set; }
        public DateTime? LastLoginDate { get; set; }
        public DateTime DtAktualizace{ get; set; }
        public DateTime? DatumISImportu { get; set; }
        public string Language{ get; set; }
        

        public string Position { get; set; }
        public string Company { get; set; }

        public override string GetId()
        {
            return Id.ToString();
        }
    }


    public class UserView : IExcludeHistory
    {
        public Guid Id { get; set; }
        
        [NotMapped]
        public string FullName => FirstName + " " + LastName;

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Telephone { get; set; }
        public bool IsActive { get; set; }

    }
}