import { Dashboard } from '../app/dashboard/Dashboard';
import { DashboardStore } from '../app/dashboard/DashboardStore';
import { EmptyStore, IRouteInfo, RouterConfig } from '../routing/RoutingTypes';
import { LoginComponent } from './users/login/LoginComponent';
import { LoginStore } from './users/login/LoginStore';
import { MainState } from '../app/MainState';
import { NotFoundComponent } from '../routing/components/NotFound';
import { RouteId } from './routes';

import { UsersListStore } from './users/list/UsersListStore';
import { UsersList } from './users/list/UsersList';
import { UserDetailStore } from './users/detail/UserDetailStore';
import { UserDetail } from './users/detail/UserDetail';
import { TokenUserInfo } from './basicTypes';

const publicRoute = (user: TokenUserInfo | null) => true;
const anyLoggedUser = (user: TokenUserInfo | null) => {
    return user !== null;
};

const login: IRouteInfo<LoginStore> = {
    path: '/login',
    routeId: RouteId.Login,
    component: LoginComponent,
    getStore: (params, {login: loginFn, switchLanguage , messageService, routingService }) =>
     new LoginStore(loginFn, switchLanguage, messageService,  routingService),
     canAccess: publicRoute
};

const usersList: IRouteInfo<UsersListStore> = {
    path: '/users',
    routeId: RouteId.UsersList, 
    component: UsersList,
    getStore: (params, {usersService, routingService}) => new UsersListStore(usersService, routingService),
    canAccess: anyLoggedUser
};

const userDetail: IRouteInfo<UserDetailStore> = {
    path: '/users/detail(/:id)',
    routeId: RouteId.UserDetail,
    component: UserDetail,
    getStore: (params, {usersService, routingService}) => new UserDetailStore(params.id, usersService,  routingService),
    canAccess: anyLoggedUser
};

const dashboard: IRouteInfo<DashboardStore> = {
    path: '/',
    routeId: RouteId.Dashboard,
    component: Dashboard,
    getStore: (state) => new DashboardStore(state.routingService, state),
    canAccess: anyLoggedUser
};

const routingDefinition: RouterConfig = {
    notFoundComponent: NotFoundComponent,
    indexRoute: dashboard,
    routes: [    
        login,                        
        userDetail,
        usersList
    ],
    loginRouteId: RouteId.Login
    
};

export default routingDefinition;
