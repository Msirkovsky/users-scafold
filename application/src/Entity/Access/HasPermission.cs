namespace Scaffolding.Entity.Access
{
    public class HasPermission
    {
        public int PermissionId { get; }
        public OperationType OperationType { get; }

        public HasPermission(int permissionId, OperationType operationType)
        {
            PermissionId = permissionId;
            OperationType = operationType;
        }
    }
}