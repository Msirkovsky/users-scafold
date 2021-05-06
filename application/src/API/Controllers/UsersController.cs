using System;
using System.Threading.Tasks;
using API.Infrastructure;
using API.Models.Authentication;
using API.Models.Users;
using API.Services.Users;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using My.Shared.Authentication;
using Scaffolding.Entity.EF;
using Scaffolding.Entity.Entities.Users;

namespace API.Controllers
{
    [CoreAuthenticate]
    [Route("api/[controller]")]
    public class UsersController : BaseController
    {
        private readonly EntityContext _dbContext;
        private readonly UserReadService _userReadService;
        private readonly UserWriteService _userWriteService;
        private readonly ICurrentUserProvider _currentUserProvider;

        public UsersController(EntityContext dbContext, UserReadService userReadService, ICurrentUserProvider currentUserProvider, UserWriteService userWriteService)
        {
            _dbContext = dbContext;
            _userReadService = userReadService;
            _currentUserProvider = currentUserProvider;
            _userWriteService = userWriteService;
        }

        [HttpGet("Filter")]
        public IActionResult Filter()
        {
            var query = _dbContext.UserView;
            var gridRequest = GridHelper.ParseGridRequest(HttpContext);
            var gridResponse = query.EnhanceForGrid(gridRequest);
            return new ObjectResult(gridResponse);
        }

        [HttpGet("List")]
        public Task<UserView[]> List()
        {
            return _dbContext.UserView.ToArrayAsync();
        }

        [HttpGet("New")]
        public Task<UserEditModel> New()
        {
            return _userReadService.New();
        }

        [HttpGet("GetForEdit/{id}")]
        public Task<UserEditModel> GetForEdit(Guid id)
        {
            return _userReadService.Get(id);
        }

        [HttpPost("save")]
        public Task<SaveResult> SaveUserEditModel([FromBody] UserModel model)
        {
            return _userWriteService.Save(model);
        }

        [HttpGet("getActualUserInfo")]
        public ActualUserInfo GetActualUserInfo()
        {
            var coreUser =_currentUserProvider.GetCurrentUser();
            return new ActualUserInfo(coreUser.Fullname, coreUser.Email);
        }
       
    }
}