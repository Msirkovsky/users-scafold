using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Xml;
using Scaffolding.Entity.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Scaffolding.Entity.EF
{
    public class AuditLog : IAuditLog, IExcludeHistory
    {
        public int Id { get; set; }
        public Guid IdAuthenticatedUser { get; set; }
        public Guid IdRealAuthenticatedUser { get; set; }
        public int Action { get; set; }

        public DateTime TimeStamp { get; set; }

        public string AuditedColumn { get; set; }
        public string IdAuditSession { get; set; }
        public Guid EntityId { get; set; }
        public string TableName { get; set; }
        public string ClrTypeName { get; set; }

        public void SetBy(IAuditLog log)
        {
            Id = log.Id;
            EntityId = log.EntityId;
            Action = log.Action;
            AuditedColumn = log.AuditedColumn;
            IdAuditSession = log.IdAuditSession;
            EntityId = log.EntityId;
            TimeStamp = log.TimeStamp;
            TableName = log.TableName;
            ClrTypeName = log.ClrTypeName;
            IdAuthenticatedUser = log.IdAuthenticatedUser;
            IdRealAuthenticatedUser = log.IdRealAuthenticatedUser;

        }
         
    }

    public interface IAuditLog
    {
        int Id { get; set; }
        int Action { get; set; }
        DateTime TimeStamp { get; set; }
        string AuditedColumn { get; set; }
        string IdAuditSession { get; set; }
        Guid EntityId { get; set; }
        string TableName { get; set; }
        string ClrTypeName { get; set; }
        Guid IdRealAuthenticatedUser { get; set; }
        Guid IdAuthenticatedUser { get; set; }
    }

    public class HistoryConfiguration
    {
        public HistoryConfiguration(string auditedVersion, Guid idUser, Guid idRealAuthenticatedUser)
        {
            AuditedVersion = auditedVersion;
            IdUser = idUser;
            IdRealAuthenticatedUser = idRealAuthenticatedUser;

        }
        public string AuditedVersion { get; }
        public Guid IdUser { get; }
        public Guid IdRealAuthenticatedUser { get; set; }
    }


    public class TypeMap
    {
        public TypeMap(bool enableAuditing)
        {
            EnableAuditing = enableAuditing;
        }

        public bool EnableAuditing { get; }
        public virtual string TableName { get; set; }
        public Type CLRType { get; set; }
        public string EntitySetName { get; set; }
        public virtual PropertyInfo PrimaryKey { get; set; }

        public virtual bool IsSupportedPrimaryKey => true;
    }


    public static class HistoryExtensions
    {
        public static List<IAuditLog> GetAuditedItems(this DbContext context, HistoryConfiguration configuration)
        {
            var idSession = Guid.NewGuid().ToString();
            var retList = new List<IAuditLog>();
            //zjistím změny

            foreach (var ent in context.ChangeTracker.Entries().Where(p => p.State == EntityState.Added || p.State == EntityState.Deleted || p.State == EntityState.Modified))
            {

                var auditLog = GetAuditRecordsForChange(ent, idSession, configuration);
                if (auditLog != null)                    
                    retList.Add(auditLog);
            }
            return retList;
        }

        private static AuditLogHistory GetAuditRecordsForChange(EntityEntry dbEntry, string idSession, HistoryConfiguration configuration)
        {
            var pocoTyp = dbEntry.Entity.GetType();
            if (typeof(IExcludeHistory).IsAssignableFrom(pocoTyp))
                return null;

            var tableMap = new TypeMap(true) {CLRType = pocoTyp, TableName = pocoTyp.Name};
            if (tableMap.EnableAuditing == false)
            {
                return null;
            }

            var changeTime = DateTime.Now;
            Guid idEntity;
            try
            {
                idEntity = new Guid(((IIdentifiable)dbEntry.Entity).GetId());
            }
            catch (Exception exception)
            {
                throw new InvalidOperationException("Pozor historie na objektu ktery nema GUID Klic. Nechtel si to excludovat z historie - objekt: " + dbEntry.Entity.GetType(), exception);
            }

            var tableName = tableMap.TableName;
            var result = new AuditLogHistory
            {
                IdAuthenticatedUser = configuration.IdUser,
                IdRealAuthenticatedUser = configuration.IdRealAuthenticatedUser,
                TimeStamp = changeTime,
                ClrTypeName = pocoTyp.FullName,
                TableName = tableName,
                IdAuditSession = idSession,
                EntityId = idEntity
            };

            if (dbEntry.State == EntityState.Added)
            {
                result.Action = (byte)HistoryAction.Insert;
                result.AuditedColumn = GetAuditedColum(dbEntry, true, configuration);
            }

            else if (dbEntry.State == EntityState.Deleted)
            {
                result.Action = (byte)HistoryAction.Delete;
                result.AuditedColumn = null;
            }
            else if (dbEntry.State == EntityState.Modified)
            {
                result.Action = (byte)HistoryAction.Update;
                result.AuditedColumn = GetAuditedColum(dbEntry, false, configuration);
            }

            return result;
        }

        /// <summary>
        /// Získání auditních informací pro daný typ.
        /// </summary>
        /// <param name="entityType">Typ entity.</param>
        /// <returns>Získané auditní informacee.</returns>
        private static EntityAuditingInfo CreateAuditingInfo(Type entityType)
        {
            // auditovane hodnoty vlastnosti
            var a = entityType.GetProperties();

            var auditedPropertyNames = new List<string>();
            var list = entityType.GetProperties().ToList();
            foreach (var pi in list)
            {
                if ((pi.PropertyType.GetTypeInfo().IsValueType || pi.PropertyType == typeof(string)) && (pi.GetCustomAttributes(true).Any(i => i is NotMappedAttribute) == false))
                {

                    auditedPropertyNames.Add(pi.Name);
                }
            }

            var entityTypeName = entityType.Name;
            // vytvoreni auditnich informaci o typu
            var info = new EntityAuditingInfo
            {
                IsAudited = true,
                KeyProperty = "Id",
                AuditedPropertyNames = auditedPropertyNames,
                EntityType = 1
            };

            return info;

        }

        private static string GetAuditedColum(EntityEntry dbEntry, bool isNew, HistoryConfiguration configuration)
        {
            var info = CreateAuditingInfo(dbEntry.Entity.GetType());
            return GetAuditedColumns(dbEntry, info.AuditedPropertyNames, isNew, configuration);
        }

        private static string GetAuditedColumns(EntityEntry entry, List<string> propertyNames, bool isNew, HistoryConfiguration configuration)
        {
            if (propertyNames.Count == 0)
                return null;

            var builder = new StringBuilder();
            var writer = XmlWriter.Create(builder);

            // vytvoření XML 
            writer.WriteStartElement("columns");
            writer.WriteAttributeString("version", configuration.AuditedVersion);
            foreach (var propertyName in propertyNames)
            {
                object originalValue = null;
                if (isNew == false)
                {
                    if (entry.OriginalValues.Properties.Any(x => x.Name== propertyName))
                    {
                        originalValue =  entry.Property(propertyName).OriginalValue;
                        //originalValue = entry.OriginalValues.GetValue<object>(propertyName);
                    }
                }

                object currentValue;
                if (entry.CurrentValues.Properties.Any(x => x.Name== propertyName))
                {
                    currentValue = entry.CurrentValues[propertyName];
                }
                else
                {
                    continue;
                }

                writer.WriteStartElement("column");
                writer.WriteAttributeString("name", propertyName);

                if (isNew == false && originalValue != null && originalValue.Equals(currentValue) == false)
                {
                    writer.WriteElementString("original", originalValue.ToString());
                }
                else if (originalValue == null && currentValue != null)
                {
                    writer.WriteElementString("original", "db-null");
                }

                writer.WriteElementString("current", currentValue == null ? String.Empty : currentValue.ToString());
                writer.WriteEndElement();
            }
            writer.WriteEndElement();
            writer.Flush();
            return builder.ToString();
        }
    }

    public class AuditLogHistory : IAuditLog
    {
        public int Id { get; set; }
        public int IdTable { get; set; }
        public string TableName { get; set; }
        public string ClrTypeName { get; set; }
        public Guid IdRealAuthenticatedUser { get; set; }
        public Guid IdAuthenticatedUser { get; set; }
        public int Action { get; set; }
        public DateTime TimeStamp { get; set; }
        public string AuditedColumn { get; set; }
        public string IdAuditSession { get; set; }
        public Guid EntityId { get; set; }
 
    }

    public class EntityAuditingInfo
    {
        public bool IsAudited { get; set; }
        public short? EntityType { get; set; }
        public string KeyProperty { get; set; }
        public List<string> AuditedPropertyNames { get; set; }
    }

    public enum HistoryAction
    {
        Insert = 1, Update, Delete
    }

    public interface IExcludeHistory
    {
    }

}
