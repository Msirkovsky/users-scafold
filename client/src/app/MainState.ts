import { action, observable } from 'mobx';
import {  UsersService } from '../generated';
import { Config } from './constants';
import { HttpService, MessageService, RoutingService } from '../services';
import { RouterConfig, RouteId, TokenUserInfo } from './basicTypes';
import { RouterStore } from '../routing/RouterStore';
import { Base64 } from 'js-base64';
import { switchToLanguage } from './translations';

export class MainState {
    routingState:  RouterStore;
    httpService: HttpService;
    messageService: MessageService;
    routingService: RoutingService;
    usersService: UsersService;
    @observable.ref userInfo: TokenUserInfo | null = null;

    constructor(routerConfig: RouterConfig) {
        
        this.messageService = new MessageService();
        this.httpService = new HttpService(Config.ServerURL, this.messageService);
        const token = this.httpService.getToken();
        
        if (token !== null) { 
            this.setUserInformation(token);
            this.switchLanguage(this.userInfo == null ? 'cz' : this.userInfo.l);
        }
        
        this.routingState = new RouterStore(routerConfig, this, this.messageService);
        this.routingService = new RoutingService(this.routingState);
        this.usersService = new UsersService(this.httpService);
    }

    @action setUserInformation = (token: string) => {
        const start = token.indexOf('.');
        const end = token.indexOf('.', start + 1);
        const base64Info = token.substring(start + 1, end);
        const decoded = Base64.fromBase64(base64Info);
        var json = JSON.parse(decoded);
        if (!json) {
            throw 'Bad token';
        }
        
        json.claim_permission = JSON.parse(json.claim_permission);

        this.userInfo = json;
    }

    @action logout = () => {
        this.httpService.logout();
        this.userInfo = null;
        this.routingService.navigateTo(RouteId.Login);
    }

    login = (loginData: any) => {
        return this.httpService.login(loginData)
            .then((token) => {
                 this.setUserInformation(token);
                 this.switchLanguage(this.userInfo == null ? 'cz' : this.userInfo.l);
                 return loginData.typ;
            });
    }

    setNotificationComponent = (notificationComponent: any) => {
        this.messageService.setNotificationComponent(notificationComponent);
    }

    switchLanguage = (code: string) => {
        switchToLanguage('cz');
    }
}