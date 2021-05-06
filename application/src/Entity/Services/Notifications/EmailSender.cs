using System;
using System.Linq;
using Scaffolding.Entity.EF;
using Scaffolding.Entity.Entities.Common;

namespace Scaffolding.Entity.Services.Notifications
{
    public class EmailSender
    {
        private readonly EntityContext _dbContext;
        private readonly ISmtpClientWrapper _smtpClientWrapper;

        public EmailSender(EntityContext dbContext, ISmtpClientWrapper smtpClientWrapper)
        {
            _dbContext = dbContext;
            _smtpClientWrapper = smtpClientWrapper;
        }

        private static readonly object _lock = new object();
        public void SendWithLock(int count)
        {
            lock (_lock)
            {
                var emails = _dbContext.EmailMessageForSendView.Where(p => p.State == EmailMessageState.PreparedToSend)
                    .OrderBy(p => p.DtCreate).Take(count).ToArray();
                foreach (var emailMessage in emails)
                {
                    //zatim posilam jen na sebe// TODO pak pryc
                    if (emailMessage.Adress == "msirkovsky@gmail.com")
                    
                    {
                        _smtpClientWrapper.Send(emailMessage.Body, emailMessage.Subject, emailMessage.Adress);
                        var adress = _dbContext.EmailAdress.Find(emailMessage.AdressId);
                        adress.DtSend=DateTime.Now;
                        adress.State = EmailMessageState.Sent;
                        _dbContext.SaveChangesAsync();
                    }
                }
            }
        }
    }
}