using System;

namespace API.Infrastructure
{
    public class SaveResult
    {
        public SaveResult(bool isOk)
        {
            IsOk = isOk;
        }

        public SaveResult(bool isOk, Guid createdEntityId)
        {
            IsOk = isOk;
            CreatedEntityId = createdEntityId;
        }


        public SaveResult(string error)
        {
            IsOk = false;
            Errors = new[] {error};
        }

        public SaveResult(string[] errors)
        {
            IsOk = false;
            Errors = errors;
        }

        public bool IsOk { get; }
        public Guid? CreatedEntityId { get; }

        public string[] Errors { get; }
        public static SaveResult Ok => new SaveResult(true);
        public static SaveResult Created(Guid id) => new SaveResult(true,id);

        public static SaveResult Fail(string message)
        {
            return new SaveResult(message);
        }
    }
}