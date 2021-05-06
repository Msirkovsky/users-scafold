using System;
using System.Linq;
using System.Threading.Tasks;
using API.Models.Users;
using API.Services.Common;
using Microsoft.EntityFrameworkCore;
using Scaffolding.Entity.Access;
using Scaffolding.Entity.EF;

namespace API.Services.Users
{
    public class UserReadService
    {
        private readonly EntityContext _dbContext;
        private readonly MapperService _mapperService;
        private readonly IUserAccess _userAccess;

        public UserReadService(EntityContext dbContext, MapperService mapperService,
           IUserAccess userAccess)
        {
            _dbContext = dbContext;
            _mapperService = mapperService;
            _userAccess = userAccess;
        }

        public async Task<UserEditModel> Get(Guid userId)
        {
            var user = await _dbContext.User.FirstAsync(p => p.Id == userId);

            //scalar props
            var userModel = _mapperService.Map<UserModel>(user);
            if (user.LastLoginDate.HasValue)
                userModel.LastLoginDateStr = user.LastLoginDate.ToString();

            //complex props
            userModel.Roles = await _dbContext.UserRole.Where(p => p.UserId == userId).Select(p => p.RoleId).ToArrayAsync();
            var userDatasource = new DetailUserDatasource
            {
                CanEdit = _userAccess.CanEditUser(userId).Ok,
                Roles = await _dbContext.Role.ToArrayAsync()
            };

            var canEdit = _userAccess.CanEditUser(userId).Ok;
            return new UserEditModel(userModel, userDatasource, canEdit);
        }

        public async Task<UserEditModel> New()
        {
            var userModel = new UserModel
            {
                IsActive = true,
                LastLoginDateStr = ""
            };

            var userDatasource = new DetailUserDatasource
            {
                CanEdit = true,
                Roles = await _dbContext.Role.ToArrayAsync()
            };

            return new UserEditModel(userModel, userDatasource, true);
        }
    }
}