using Scaffolding.Entity.EF;

namespace Scaffolding.Entity.Entities.Common
{
    public class StateInfo : IExcludeHistory
    {
        public string Name { get; set; }
        public int Id { get; set; }
        public int StateMachineId { get; set; }
    }
}