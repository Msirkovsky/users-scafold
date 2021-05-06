import { MainState } from '../../app/MainState';
import { EmptyStore } from '../../routing/RoutingTypes';
import { RoutingService } from '../../services';
import { RouteId } from '../routes';

export class DashboardStore extends EmptyStore {

    mainState: MainState;
    constructor(private routingService: RoutingService, mainState: MainState) {
        super();
        this.mainState = mainState;
    }

    navigateTo = (route: RouteId) => {
        this.routingService.navigateTo(route);
    }
}