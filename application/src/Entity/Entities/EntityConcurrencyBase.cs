using System;
using System.ComponentModel.DataAnnotations;

namespace Scaffolding.Entity.Entities
{
    public abstract class EntityConcurrencyBase : IIdentifiable
    {
        [Timestamp]
        [ConcurrencyCheck]
        public Byte[] RowVersion { get; set; }

        public abstract string GetId();

        public bool IsDeleted { get; set; }

        public DateTime DtCreated { get; set; }
        public Guid  AuthorId{ get; set; }
    }
}