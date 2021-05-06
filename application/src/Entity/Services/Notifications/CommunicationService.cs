using System.Collections.Generic;
using System.Linq;
using Scaffolding.Entity.EF;
using Scaffolding.Entity.Entities.Common;
using Scaffolding.Entity.Utils;
using Microsoft.Extensions.Options;

namespace Scaffolding.Entity.Services.Notifications
{
    public interface ICommunicationService
    {
        void RegisterEmailToSend(string body, string subject, params string[] adresa);
        //void Send(int countOfEmails);
    }

    public class CommunicationService : ICommunicationService
    {
        private readonly EntityContext _dbContext;

        public CommunicationService(EntityContext dbContext, IOptions<SmtpConfig> config)
        {
            _dbContext = dbContext;
            CoreValidation.NotNull(config, nameof(config) + " != null");
        }

        public void RegisterEmailToSend(string body, string subject, params string[] adresy)
        {
            var m = new EmailMessage
            {
                Adresses = new List<EmailAdress>()
            };
            var listAdres = adresy.Select(p => new EmailAdress { Adress = p, EmailMessageId = m.Id, State = EmailMessageState.PreparedToSend }).ToList();
            m.Subject = subject;
            m.Body = body;
            m.Adresses.AddRange(listAdres);
            _dbContext.EmailMessage.Add(m);
            _dbContext.SaveChangesAsync();
        }

    }


    public class SmtpConfig
    {
        public string Host { get; set; }
        public string User { get; set; }
        public string Password { get; set; }
        public int Port { get; set; }
    }

}