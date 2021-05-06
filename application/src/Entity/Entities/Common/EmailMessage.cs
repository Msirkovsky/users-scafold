using System;
using System.Collections.Generic;
using Scaffolding.Entity.EF;

namespace Scaffolding.Entity.Entities.Common
{
    public sealed class EmailMessage : IExcludeHistory
    {
        public EmailMessage()
        {
            IsBodyHtml = true;
            DtCreate = DateTime.Now;
        }

        public int Id { get; set; }

        public string Subject { get; set; }
        public string Body { get; set; }
        public int Priority { get; set; }
        public bool IsBodyHtml { get; set; }
        public DateTime DtCreate { get; set; }

        public List<EmailAdress> Adresses { get; set; }
        public string GetId()
        {
            return Id.ToString();
        }
    }
}