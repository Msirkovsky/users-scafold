import { MainState } from '../app/MainState';
import { RouteId } from '../app/routes';
import { TokenUserInfo } from '../app/basicTypes';

export interface IBasicMobxStore<T> {
    loadData(): Promise<T>;
    setData(data: T): void;
}

export interface IRouteInfo<T extends IBasicMobxStore<any>> {
    routeId: RouteId;
    path: string;
    component: React.ComponentClass<{ store: T }> | React.StatelessComponent<{ store: T }>;
    disposeStore?: (store: T) => void;

    getStore: (routeParams: any, globalStore: MainState) => T;
    canAccess: (user: TokenUserInfo | null) => boolean;
}

export type RouterConfig = {
    notFoundComponent: React.ComponentClass<any> | React.StatelessComponent<any>;
    indexRoute: IRouteInfo<any>;
    routes: IRouteInfo<any>[];
    loginRouteId: RouteId;
};

export class EmptyStore {
    setData = (data: any) => { return; };
    loadData = () => {
        return new Promise((resolve, reject) => {
            resolve({});
        });
    }
}
