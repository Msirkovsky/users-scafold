using System;
using System.Security;
using Scaffolding.Entity.Entities.Users;
using My.Shared.Authentication;
using My.Shared.Authentication.Models;

namespace Scaffolding.Entity.Access
{

    public class UserAccess : IUserAccess
    {
        private readonly ICurrentUserProvider _currentUserProvider;

        public UserAccess(ICurrentUserProvider currentUserProvider)
        {
            _currentUserProvider = currentUserProvider;
        }

        public bool IsInRole(int permission)
        {
            return _currentUserProvider.GetCurrentUser().HasPermission(permission);
        }
 

        public bool HasPermission(int permission)
        {
            return _currentUserProvider.GetCurrentUser().HasPermission(permission);
        }

        public Guid GetCurrentUserId()
        {
            return _currentUserProvider.GetCurrentUser().IdGuid;
        }

        public bool HasAnyPermissions(params int[] permissions)
        {
            foreach (var permission in permissions)
            {
                if (HasPermission(permission))
                    return true;
            }

            return false;
        }

        public void CheckPermission(int permission)
        {
            if (HasPermission(permission) == false)
                throw new SecurityException("Missing the permission: " + permission);
        }

        public AccessResult CanViewUser(Guid id)
        {
            return _currentUserProvider.GetCurrentUser().HasPermission(Permission.ADMIN_OVERRIDE)
                ? AccessResult.True()
                : AccessResult.False("Missing: " + Permission.ADMIN_OVERRIDE);
        }

        public AccessResult CanEditUser(Guid id)
        {
            return _currentUserProvider.GetCurrentUser().HasPermission(Permission.ADMIN_OVERRIDE)
                ? AccessResult.True()
                : AccessResult.False("Missing: " + Permission.ADMIN_OVERRIDE);
        }
    }

   


    public interface IUserAccess
    {
        AccessResult CanEditUser(Guid id);
        bool HasPermission(int permission);
        Guid GetCurrentUserId();
        bool HasAnyPermissions(params int[] permission);
        void CheckPermission(int permission);
        bool IsInRole(int role);
    }

    public class UserAccessInfo
    {
        public int StrediskoId { get; }
        public string Email { get; set; }

        public UserAccessInfo(CoreUser user, int strediskoId)
        {
            StrediskoId = strediskoId;
            Email = user.Email;
            //a další
        }
    }

    public interface IAccessService
    {
        void Check(DelayedCheckChain delayedCheck);
        void Check(Func<AccessResult> callback);
    }


}