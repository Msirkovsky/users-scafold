using System.Collections.Generic;
using Scaffolding.Entity.Utils;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Scaffolding.Entity.Services.Notifications
{
    public interface ISmtpClientWrapper 
    {
        void Send(string body, string subject, string adresa);
        void Send(string body, string subject, IEnumerable<string> adresy);
    }


    public class SmtpClientWrapper : ISmtpClientWrapper
    {
        private readonly SmtpConfig _config;

        public SmtpClientWrapper(IOptions<SmtpConfig> config)
        {
            CoreValidation.NotNull(config, nameof(config) + " != null");
            _config = config.Value;
        }

        public void Send(string body, string subject, string adresa)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("info@TODO.eu","info@TODO.eu"));
            message.To.Add(new MailboxAddress(adresa,adresa));
            message.Subject = subject;

            var bodyBuilder = new BodyBuilder {HtmlBody = body};
            message.Body = bodyBuilder.ToMessageBody();
            using (var client = new SmtpClient())
            {
                client.Connect(_config.Host, _config.Port, false);
                client.Authenticate(_config.User, _config.Password);
                // Note: since we don't have an OAuth2 token, disable 	// the XOAUTH2 authentication mechanism.
                client.AuthenticationMechanisms.Remove("XOAUTH2");
                client.Send(message);
                client.Disconnect(true);
            }

        }

        public void Send(string body, string subject, IEnumerable<string> adresy)
        {
            foreach (var adresa in adresy)
            {
                Send(body,subject, adresa);    
            }
        }
    }
}