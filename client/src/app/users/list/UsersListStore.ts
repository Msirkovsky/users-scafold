import { EmptyStore  } from '../../../routing/RoutingTypes';
import { UsersService } from '../../../generated';
import { RoutingService  } from '../../../services';
import { RouteId } from '../../routes';

export class UsersListStore extends EmptyStore {

    constructor(private usersService: UsersService, private routingService: RoutingService) {
        super();
    }

    toNewUser = () => this.routingService.navigateTo(RouteId.UserDetail);
    getUserList = (queryParams: object) => this.usersService.FilterGet({queryParams});
}