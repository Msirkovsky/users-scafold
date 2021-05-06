using System;
using System.Linq;

namespace Scaffolding.Entity.Access
{
    public class DelayedCheckChain
    {
        public DelayedCheckChain Previous { get; set; }
        public OperationType OperationType { get; set; }

        public DelayedCheckChain(DelayedCheckChain previous)
        {
            OperationType = OperationType.And;
            Previous = previous;
        }

        public Func<int[], AccessResult> PermissionsFuncs { get; set; }

        public static DelayedCheckChain Zero()
        {
            return new EmptyDelayedCheckChain();
        }

        public DelayedCheckChain OrHasPermission(int permissionId)
        {
            AccessResult Evaluate(int[] x) => x.Contains(permissionId) == false
                ? AccessResult.False("Missing permission: " + permissionId)
                : AccessResult.True();

            return new DelayedCheckChain(this)
            {
                PermissionsFuncs = Evaluate,
                OperationType = OperationType.Or
            };
        }
    }

    public class EmptyDelayedCheckChain : DelayedCheckChain
    {
        public EmptyDelayedCheckChain() :base(null)
        {
        }
    }
}