using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using My.Shared.Authentication;

namespace API.Infrastructure
{
    public class CoreAuthorizeAttribute : ActionFilterAttribute
    {
        private readonly int[] _roles;

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var user = context.HttpContext.User.ToCoreUser();
            if (user.Permissions.Any(x => _roles.Contains(x)) == false)
            {
                context.Result = new StatusCodeResult((int)System.Net.HttpStatusCode.Forbidden);
            }
            base.OnActionExecuting(context);
        }

        public CoreAuthorizeAttribute(int role)
        {
            _roles = new [] {role};
        }
    }
}