import { observable, action, reaction, runInAction } from 'mobx';
import { RouterConfig, IBasicMobxStore } from '../routing/RoutingTypes';
import { RouteId } from '../app/routes';
import { MainState } from '../app/MainState';
import { MessageService } from '../services';
import * as UrlPattern from 'url-pattern';
import { TokenUserInfo } from '../app/basicTypes';

interface RouteWithParams {
    route: RouteInternal;
    params: any;
}

type RouteInternal = {
    routeId: RouteId;
    urlPattern: UrlPattern;
    path: string;
    component: React.ComponentClass<any>;
    disposeStore?: (store: IBasicMobxStore<any>) => void;
    getStore: (routeParams: any, globalStore: MainState) => any;
    canAccess: (user: TokenUserInfo | null) => boolean;
};

type RouterConfigInternal = {
    notFoundComponent: React.ComponentClass<any> | React.StatelessComponent<any>;
    indexRoute: RouteInternal;
    routes: RouteInternal[];
    loginRouteId: RouteId;
};

const getBase = () => window.location.pathname.replace(/\/$/, '');
const mapRoute = (route: any): RouteInternal => {
    return {
        routeId: route.routeId,
        urlPattern: new UrlPattern(route.path),
        path: route.path,
        getStore: route.getStore,
        component: route.component,
        disposeStore: route.disposeStore,
        canAccess: route.canAccess
    };
};

export class RouterStore {
    returnRoute: RouteWithParams | null = null;
    @observable isLoading: boolean = false;
    @observable fullScreen: boolean = false;
    routerConfig!: RouterConfigInternal;
    route: RouteInternal | null = null;
    mainState: MainState;
    @observable RoutePath: string = '';
    @observable RouteParams: any = {};
    @observable.ref CurrentView: React.ComponentClass<any> | React.StatelessComponent<any> | null = null;
    @observable currentStore: IBasicMobxStore<any> | null = null;
    wasInitialRouteHandled = false;

    private currentPromise: Promise<any> | null = null;

    constructor(routes: RouterConfig, mainState: MainState, private messageService: MessageService) {
        this.mainState = mainState;
        this.setNewRoutes(routes);
    }

    @action replaceRoutes = (routes: RouterConfig) => {
        this.setNewRoutes(routes);
        const routePath = getBase();
        if (!routePath) {
            this.CurrentView = this.routerConfig.indexRoute.component;
        } else {
            for (let route of this.routerConfig.routes) {
                let newParams = route.urlPattern.match(routePath);
                if (newParams != null) {
                    this.CurrentView = route.component;
                    return;
                }
            }
            // Not found
            this.showNotFound();
        }
    }

    @action getDataStore(store: IBasicMobxStore<any>, routeParams: any) {
        this.mainState.routingState.isLoading = true;
        this.currentStore = store;

        const loadPromise = store.loadData();
        this.currentPromise = loadPromise;
        const promiseResult = loadPromise.then((data) => {
            if (this.currentPromise === loadPromise) {
                runInAction(() => {
                    store.setData(data);
                    this.mainState.routingState.isLoading = false;
                });
            }
        });

        if (process.env.NODE_ENV !== 'development' ) {
            promiseResult.catch((error) => {
                // tslint:disable-next-line:no-console
                console.error(error);
                this.messageService.showError('Something went wrong, see developer console');
            });
        }
    }

    @action activateRoute(route: RouteInternal, routeParams: any) {
        this.deactivateRoute();

        this.RouteParams = routeParams;
        this.route = route;
        this.getDataStore(route.getStore(routeParams, this.mainState), routeParams);
        this.CurrentView = route.component;
    }

    @action deactivateRoute() {
        //        this.globalState.clearMessages();
        this.mainState.routingState.isLoading = false;
        if (this.route != null && this.currentStore != null && this.route.disposeStore) {
            this.route.disposeStore(this.currentStore);
        }

        this.currentStore = null;
    }

    getActualRoute = () => {
        const routePath = getBase();
        let routeInfo: RouteWithParams | null = null;

        if (!routePath) {
            routeInfo = {route: this.routerConfig.indexRoute, params: {}};
        } else {
            for (let route of this.routerConfig.routes) {
                let params = route.urlPattern.match(routePath);
                if (params != null) {
                    routeInfo = {route, params};
                    break;
                }
            }
        }
        return routeInfo;
    }

    @action handleRouteChange() {
        const routeInfo = this.getActualRoute();
        if (routeInfo != null) {
            const userInfo = this.mainState.userInfo;
            if (routeInfo.route.canAccess(userInfo)) {
                if (routeInfo.route.routeId !== this.routerConfig.loginRouteId) {
                    this.returnRoute = null;
                }
                this.activateRoute(routeInfo.route, routeInfo.params);
            } else {
                this.returnRoute = routeInfo;
                this.navigateToRoute(this.routerConfig.loginRouteId, {});
            }
        } else {
            this.returnRoute = null;
            this.showNotFound();            
        }
    }

    navigateToReturnRoute = () => {
        if (this.returnRoute === null) {
            this.navigateToRoute(this.routerConfig.indexRoute.routeId, {});
        } else {
            this.navigateToRoute(this.returnRoute.route.routeId, this.returnRoute.params);
        }
    }

    @action showNotFound() {
        this.deactivateRoute();
        this.RouteParams = {};
        this.CurrentView = this.routerConfig.notFoundComponent;
    }

    @action navigateToRoute(newRouteId: RouteId, params: any = {}, replaceCurrent: boolean = false) {
        const routePath = getBase();

        if (newRouteId === this.routerConfig.indexRoute.routeId) {
            if (replaceCurrent) {
                window.history.replaceState(null, '', '/');
            } else {
                window.history.pushState(null, '', '/');
            }
            this.handleRouteChange();
            return;
        } else {
            const route = this.routerConfig.routes.find(x => x.routeId === newRouteId);
            if (route) {
                let newUrl = route.urlPattern.stringify(params);
                if (newUrl !== routePath) {
                    if (replaceCurrent) {
                        window.history.replaceState(null, '', newUrl);
                    } else {
                        window.history.pushState(null, '', newUrl);
                    }
                }
                this.handleRouteChange();
                return;
            }
        }
        window.history.pushState(null, '', 'not-existing-route');
        this.showNotFound();
    }

    private setNewRoutes = (config: RouterConfig) => {
        this.routerConfig = {
            notFoundComponent: config.notFoundComponent,
            indexRoute: mapRoute(config.indexRoute),
            routes: config.routes.map((route: any) => mapRoute(route)),
            loginRouteId: config.loginRouteId
        };
    }

}