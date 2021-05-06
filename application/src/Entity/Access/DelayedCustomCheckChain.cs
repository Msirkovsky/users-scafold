using System;

namespace Scaffolding.Entity.Access
{
    public class DelayedCustomCheckChain : DelayedCheckChain
    {
        public DelayedCustomCheckChain(Func<AccessResult> func, DelayedCheckChain previous) : base(previous)
        {
            PermissionsFunc = func;
        }

        public Func<AccessResult> PermissionsFunc { get; }

    }
}