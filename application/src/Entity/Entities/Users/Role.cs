using Scaffolding.Entity.EF;

namespace Scaffolding.Entity.Entities.Users
{
    public class Role : IExcludeHistory
    {
        public int Id { get; set; }

        public string Name { get; set; }
        public string Caption { get; set; }
        public string HomePageRoute { get; set; }
        public int Priority { get; set; }

    }
}