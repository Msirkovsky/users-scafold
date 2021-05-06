using System;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure;
using API.Models.Users;
using API.Services.Common;
using Microsoft.EntityFrameworkCore;
using Scaffolding.Entity.Access;
using Scaffolding.Entity.EF;
using Scaffolding.Entity.Entities.Users;

namespace API.Services.Users
{
    public class UserWriteService
    {
        private readonly EntityContext _dbContext;
        private readonly MapperService _mapperService;
        private readonly IUserAccess _userAccess;

        public UserWriteService(EntityContext dbContext, MapperService mapperService,
            IUserAccess userAccess)
        {
            _dbContext = dbContext;
            _mapperService = mapperService;
            _userAccess = userAccess;
        }

        public async Task<SaveResult> Save(UserModel userModel)
        {
            var isNew = userModel.Id.HasValue == false;

            var userId = isNew ? Guid.NewGuid() : userModel.Id.Value;

            var roles = isNew
                ? new UserRole[0]
                : await _dbContext.UserRole.Where(p => p.UserId == userId).ToArrayAsync();

            User user;
            if (isNew)
            {
                userModel.Id = Guid.NewGuid();
                user = _mapperService.Map<User>(userModel);
                user.Id = userId;
                user.Email = userModel.Email;
                _dbContext.User.Add(user);
            }
            else
            {
                user = await _dbContext.User.FindAsync(userId);
                _mapperService.Map(userModel, user);
            }

            _mapperService.MapList(
                userModel.Roles,
                roles,
                (s, d) => s == d.RoleId,
                s =>
                {
                    var newItem = new UserRole
                    {
                        UserId = userId,
                        RoleId = s
                    };
                    _dbContext.UserRole.Add(newItem);
                },
                null,
                d => _dbContext.UserRole.Remove(d)
            );

            await _dbContext.SaveChangesAsync();
            return isNew ? SaveResult.Created(userId) : SaveResult.Ok;
        }
    }
}