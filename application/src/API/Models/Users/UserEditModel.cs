namespace API.Models.Users
{
    public class UserEditModel
    {
        public UserEditModel(UserModel entity, DetailUserDatasource datasource,bool canEdit)
        {
            Entity = entity;
            Datasource = datasource;
            CanEdit = canEdit;
        }

        public UserModel Entity { get; set; }
        public DetailUserDatasource Datasource { get; }
        public bool CanEdit { get; }
    }
}