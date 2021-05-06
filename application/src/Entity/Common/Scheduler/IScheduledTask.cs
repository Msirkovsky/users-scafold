namespace Scaffolding.Entity.Common.Scheduler
{
    public interface IScheduledTask
    {
        string Name { get; }
        ScheduledTaskResult Run();
    }
}