using System;
using Scaffolding.Entity.Entities.Common;

namespace Scaffolding.Entity.Services.Notifications
{
    public class EmailMessageForSendView
    {
        
        public int Id { get; set; }

        public string Subject { get; set; }
        public string Body { get; set; }
        public int Priority { get; set; }
        public bool IsBodyHtml { get; set; }
        public DateTime DtCreate { get; set; }        
        public EmailMessageState State { get; set; }
        public string Adress { get; set; }
        public int AdressId { get; set; }
    }
}