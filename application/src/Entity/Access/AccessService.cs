using System;
using My.Shared.Authentication;

namespace Scaffolding.Entity.Access
{
    public class AccessService : IAccessService
    {
        private readonly ICurrentUserProvider _userProvider;

        public AccessService(ICurrentUserProvider userProvider)
        {
            _userProvider = userProvider;
        }

        public void Check(DelayedCheckChain delayedCheck)
        {
            var permissions = _userProvider.GetCurrentUser().Permissions;

            AccessResult CheckRec(DelayedCheckChain dc, AccessResult previousResult)
            {
                AccessResult lastResult;
                if ((previousResult == null) ||dc.Previous.OperationType == OperationType.Or && previousResult.Ok == false)
                {
                    if (dc is DelayedCustomCheckChain dccc)
                    {

                        lastResult = dccc.PermissionsFunc();
                    }
                    else
                    {
                        lastResult = dc.PermissionsFuncs(permissions);
                    }
                }
                else
                {
                    lastResult = previousResult;
                }
                return dc.Previous == null || dc.Previous is EmptyDelayedCheckChain
                    ? lastResult
                    : CheckRec(dc.Previous, lastResult);
            }

            var result = CheckRec(delayedCheck, null);
            if (result.Ok == false)
                throw new NotAuthorizedException("CheckAccess: false. Message: " + result.Message);
        }

        public void Check(Func<AccessResult> callback)
        {
            var result = callback();
            if (result.Ok == false)
                throw new NotAuthorizedException("CheckAccess: false. Message: " + result.Message);
        }

    }
}