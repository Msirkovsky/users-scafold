using System;
using Scaffolding.Entity.EF;
using Scaffolding.Entity.Entities.Users;
using Scaffolding.Entity.Services.Notifications;
using Microsoft.Extensions.Options;

namespace Scaffolding.Entity.Services.Users
{
    public class NewUserInsertedHandler
    {
        private readonly ICommunicationService _communicationService;
        private readonly EntityContext _dbContext;
        private readonly IOptions<APIConfig> _apiOptions;

        public NewUserInsertedHandler(ICommunicationService communicationService, EntityContext dbContext,
            IOptions<APIConfig> apiOptions)
        {
            _communicationService = communicationService;
            _dbContext = dbContext;
            _apiOptions = apiOptions;
        }

        public void Do(Guid userId, string email)
        {
            const string subject = "Změna hesla do systému "; 

            var host = _apiOptions.Value.Host + "/" + "TODO_ROUTE";
            var body = $"Dobrý den, <br/>Na této <a href='{host}'></a>adrese se můžete změnit Vaše heslo.";
            var urcp = new UserRequestChangePassword
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                DtCreate = DateTime.Now
            };
            _dbContext.UserRequestChangePassword.Add(urcp);
            _dbContext.SaveChangesAsync();
            _communicationService.RegisterEmailToSend(subject, body, email);
        }

        
        
    }
}