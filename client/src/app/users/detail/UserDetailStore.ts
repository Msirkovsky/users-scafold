import { MessageService, RoutingService } from '../../../services';
import { UsersService } from '../../../generated';
import { UserEditModel, Role } from '../../../generated/Models';
import { RouteId } from '../../routes';
import { UserDetailForm } from './UserDetailForm';
import { Translations } from '../../translations';

export class UserDetailStore {
    form!: UserDetailForm;

    constructor(
        private userId: string,
        private usersService: UsersService,        
        private routingService: RoutingService
    ) {
    }
    loadData = () => {        
        return this.userId == null
            ? this.usersService.NewGet()
            : this.usersService.GetForEditByIdGet(this.userId);
    }

    setData = (userDetail: UserEditModel) => {
        this.form = new UserDetailForm(
            userDetail, 
            (values) => {
                const newValues = {...userDetail.entity, ...values};
                return this.usersService.SavePost(newValues).then(data => {
                    if (this.userId == null) { 
                        this.routingService.navigateTo(RouteId.UserDetail, {id: data.createdEntityId}, true); 
                    }
                });
            });        
    }

    navigateToList = () => this.routingService.navigateTo(RouteId.UsersList);

    resetPassword = () => {
        this.usersService.RequestChangePasswordPost({userId: this.userId}, {customSuccesMessage: Translations.passwordChangeSuccess});
    }
}