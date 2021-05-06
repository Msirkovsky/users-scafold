import { RouteId } from '../app/routes';
import { RouterStore } from '../routing/RouterStore';
export class RoutingService {

    constructor(private routerStore: RouterStore) {
    }

    navigateTo = (route: RouteId, params: any = {}, replaceCurrent: boolean = false) => {
        this.routerStore.navigateToRoute(route, params, replaceCurrent);
    }

    navigateToReturnRoute = () => this.routerStore.navigateToReturnRoute();
}