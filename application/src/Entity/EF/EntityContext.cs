using System;
using System.Linq;
using Scaffolding.Entity.Entities;
using Scaffolding.Entity.Entities.Common;
using Scaffolding.Entity.Entities.Users;
using Scaffolding.Entity.Services.Notifications;
using Microsoft.EntityFrameworkCore;

namespace Scaffolding.Entity.EF
{
    public static class EntityContextExtension
    {
        public static T FindActive<T>(this DbSet<T> ctx, Guid id) where T : EntityConcurrencyBase
        {
            var item = ctx.Find(id);
            return item.IsDeleted ? null : item;
        }
    }

    public class EntityContext : DbContext
    {
        private readonly Guid _userIdAuthenticated;

        //tables
        public DbSet<Notifikace> Notifikace { get; set; }
        public DbSet<User> User { get; set; }
        public DbSet<Role> Role { get; set; }
        public DbSet<UserRole> UserRole { get; set; }
        public DbSet<EmailMessage> EmailMessage { get; set; }
        public DbSet<EmailAdress> EmailAdress { get; set; }
        public DbSet<UserRequestChangePassword> UserRequestChangePassword { get; set; }
        public DbSet<AuditLog> AuditLog { get; set; }
        public DbSet<Permission> Permission { get; set; }
        public DbSet<PermissionRole> PermissionRole { get; set; }
        public DbSet<StateInfo> StateInfo { get; set; }
        //views
        public DbSet<EmailMessageForSendView> EmailMessageForSendView { get; set; }
        public virtual DbSet<UserView> UserView { get; set; }

        public EntityContext(DbContextOptions<EntityContext> options)
            : base(options)
        {
            _userIdAuthenticated = Guid.Empty;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.EnableSensitiveDataLogging();
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<UserRole>(e =>
            {
                e.HasKey(x => x.Id);
                e.HasOne<User>().WithMany().HasForeignKey(x => x.UserId);
                e.HasOne<Role>().WithMany().HasForeignKey(x => x.RoleId);
            });

            builder.Entity<EmailMessage>(e =>
            {
                e.HasKey(x => x.Id);
                e.HasMany(x => x.Adresses).WithOne().HasForeignKey(x => x.EmailMessageId);
            });

            builder.Entity<EmailAdress>(e => { e.HasKey(x => x.Id); });
            builder.Entity<UserRequestChangePassword>(e =>
            {
                e.HasKey(x => x.Id);
                e.HasOne<User>().WithMany().HasForeignKey(x => x.UserId);
            });

            builder.Entity<PermissionRole>(e =>
            {
                e.HasKey(x => x.Id);
                e.HasOne<Permission>().WithMany().HasForeignKey(x => x.PermissionId);
                e.HasOne<Role>().WithMany().HasForeignKey(x => x.RoleId);
            });

            builder.Entity<Notifikace>(e =>
            {
                e.HasKey(x => x.Id);
                e.HasOne<User>().WithMany().HasForeignKey(x => x.UserId);
            });

            builder.Entity<UserRole>(e =>
            {
                e.HasKey(x => x.Id);
                e.HasOne<User>().WithMany().HasForeignKey(x => x.UserId);
                e.HasOne<Role>().WithMany().HasForeignKey(x => x.RoleId);
            });

            // Lower Table Names
            builder.Model.GetEntityTypes()
                .Select(e => e.Relational())
                .ToList()
                .ForEach(t => t.TableName = t.TableName.ToLower()
                );

            // Lower column names
            builder.Model.GetEntityTypes()
                .SelectMany(e => e.GetProperties())
                .ToList()
                .ForEach(p => p.Relational().ColumnName = p.Name.ToLower()
                );

         

            base.OnModelCreating(builder);
        }

        public override int SaveChanges()
        {
            SetHistory(false);
            return base.SaveChanges();
        }

        private void SetHistory(bool ignoreRowVersionsForForceSave)
        {
            var history = new HistoryConfiguration("1.0", Guid.Empty, Guid.Empty);
            var list = this.GetAuditedItems(history);
            foreach (var r in list)
            {
                var l = new AuditLog();
                l.SetBy(r);
                l.IdAuthenticatedUser = _userIdAuthenticated;
                l.IdRealAuthenticatedUser = _userIdAuthenticated;
                AuditLog.Add(l);
            }

            foreach (var dbEntityEntry in ChangeTracker.Entries().Where(x =>
                x.State == EntityState.Added || x.State == EntityState.Modified || x.State == EntityState.Deleted))
            {
                if (dbEntityEntry.State == EntityState.Modified || dbEntityEntry.State == EntityState.Added)
                {
                    if (dbEntityEntry.Entity is EntityConcurrencyBase)
                    {
                        if (dbEntityEntry.State == EntityState.Added)
                        {
                            dbEntityEntry.Property("DtCreated").CurrentValue = DateTime.Now;
                        }

                        if (dbEntityEntry.State == EntityState.Modified && ignoreRowVersionsForForceSave == false)
                        {
                            //EF ignores the set timestamp on the entity and uses the timestamp version that
                            //it had retrieved when the entity was retrieved from the database.
                            //https://github.com/aspnet/EntityFramework/issues/4512
                            dbEntityEntry.Property("RowVersion").OriginalValue =
                                dbEntityEntry.Property("RowVersion").CurrentValue;
                        }

                        dbEntityEntry.Property("RowVersion").IsModified = false;
                    }
                }
            }
        }
    }
}