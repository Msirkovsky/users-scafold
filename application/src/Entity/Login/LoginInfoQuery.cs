using System;
using System.Linq;
using System.Threading.Tasks;
using Scaffolding.Entity.EF;
using Microsoft.EntityFrameworkCore;
using My.Shared.Validations;

namespace Scaffolding.Entity.Login
{
    public class LoginInfoQuery
    {
        private readonly EntityContext _dbContext;

        public LoginInfoQuery(EntityContext entityContext)
        {
            _dbContext = entityContext;
        }

        public async Task<UserInfo> GetUserInfo(Guid userId)
        {
            CoreValidations.NotNull(userId, nameof(userId));

            var userinDb = await _dbContext.User.FindAsync(userId);
            var userRoles = _dbContext.UserRole.Where(p => p.UserId == userId).ToArray();

            return new UserInfo(userinDb, userRoles);
        }

        public async Task<LoginInfo> GetByEmail(string email)
        {
            var userinDb = await _dbContext.User.FirstOrDefaultAsync(p => p.Email == email);
            if (userinDb == null)
                return null;

            return new LoginInfo(userinDb.Id, userinDb.Email, userinDb.PassHash, userinDb.Language);
        }
    }
}