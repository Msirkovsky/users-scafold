using System;
using System.ComponentModel.DataAnnotations.Schema;
using Scaffolding.Entity.EF;

namespace Scaffolding.Entity.Entities.Common
{
    public class EmailAdress  : IExcludeHistory
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] //this line
        public virtual int Id { get; set; }

        public virtual string Adress { get; set; }
        public virtual EmailMessageState State { get; set; }

        public virtual int EmailMessageId { get; set; }

        public DateTime? DtSend { get; set; }
    }
}