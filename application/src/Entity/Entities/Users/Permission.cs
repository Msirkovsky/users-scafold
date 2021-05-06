using Scaffolding.Entity.EF;

namespace Scaffolding.Entity.Entities.Users
{
    public class Permission : IExcludeHistory
    {
        public static int ADMIN_OVERRIDE = 1;

        public static int LEKTOR = 2;
        public static int PERSONALISTA = 3;
        public static int STUDENT = 4;

        
        public int Id { get; set; }
        public string Name { get; set; }

    }
}
