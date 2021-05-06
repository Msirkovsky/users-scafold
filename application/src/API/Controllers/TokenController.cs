using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using API.Models.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using My.Shared.Authentication;
using My.Shared.Authentication.Config;
using Scaffolding.Entity.EF;
using Scaffolding.Entity.Login;
using Scaffolding.Entity.Utils;

namespace API.Controllers
{
    [Route("api/[controller]")]
    public class TokenController : BaseController
    {
        private readonly LoginInfoQuery _loginInfoQuery;
        private readonly EntityContext _dbContext;
        private readonly AuthenticationConfig _options;

        public TokenController(LoginInfoQuery loginInfoQuery, EntityContext dbContext,
            IOptions<AuthenticationConfig> options)
        {
            _loginInfoQuery = loginInfoQuery;
            _dbContext = dbContext;
            CoreValidation.NotNull(options.Value, "options.Value != null");
            _options = options.Value;
        }

        [HttpPost("Generate")]
        public async Task<IActionResult> Generate([FromBody] LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                var username = model.UserName;
                var password = model.Password;

                var loginInfo = await _loginInfoQuery.GetByEmail(username);
                if (loginInfo == null)
                {
                    return BadRequest("Invalid login ({username})");
                }

                if (!loginInfo.CheckPassword(password))
                {
                    return BadRequest("Invalid password");
                }
                var userInfo = await _loginInfoQuery.GetUserInfo(loginInfo.UserId);
                if (!userInfo.User.IsActive)
                {
                    return BadRequest("User is disabled ({username})");
                }

                var token = await GenerateToken(model.UserName, userInfo.User.Id, _dbContext, _options.Key);
                if (token == null)
                    return BadRequest("Bad attempt to login. User existed but doesnt have this role!");

                return Ok(new {token = new JwtSecurityTokenHandler().WriteToken(token)});
            }

            return BadRequest("Could not create token");
        }

        [CoreAuthenticate]
        [HttpGet("Refresh")]
        public async Task<IActionResult> Refresh()
        {
            var coreUser = User.ToCoreUser();
            //TODO hodit do cert
            var token = await GenerateToken(coreUser.Email, coreUser.IdGuid, _dbContext, _options.Key);
            return Ok(new {token = new JwtSecurityTokenHandler().WriteToken(token)});
        }

        private static async Task<JwtSecurityToken> GenerateToken(string userName, Guid id, EntityContext dbContext,
            string securityKey)
        {
            var user = await dbContext.User.SingleAsync(x => x.Email == userName);
            var roles = await dbContext.UserRole.Where(x => x.UserId == user.Id).Select(x => x.RoleId).ToArrayAsync();
            
            var roleName = string.Empty;
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(Configurations.CLAIM_PERMISSIONS, "["+string.Join(",", roles)+"]"),
                new Claim(Configurations.ROLE_NAME, roleName),
                new Claim("id", id.ToString()),
                new Claim("email", user.Email),
                new Claim("name", user.FullName),            
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(securityKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken("API",
                "API",
                claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds);
            return token;
        }
    }
}