import { LoginForm } from './LoginForm';

import { PasswordResetForm } from './PasswordResetForm';

import { EmptyStore, RouteId } from '../../basicTypes';
import { RoutingService, MessageService } from '../../../services/index';
import { Translations } from '../../translations';
import { observable, action, reaction } from 'mobx';

export enum TypRegistrace {
    Lektor,
    Personalista,
    Student
}

export class LoginStore extends EmptyStore {
    form: LoginForm;
    @observable.ref passwordResetForm: PasswordResetForm | null = null;

    constructor(
        private loginFn: (loginData: any) => Promise<any>,
        switchLanguageFn: (code: string) => void,
        private messageService: MessageService,        
        private routingService: RoutingService) {
      super();
      this.form = new LoginForm(this.login);
    }

    @action back = () => {
        const {password, username} = this.form;
        password.reset();
        username.reset();
        this.passwordResetForm = null;
    }

    private login = (values: any) => {
        
        this.messageService.hideMessage('login_error');
        return this.loginFn(values)
            .then((typ) => {
                this.routingService.navigateTo(RouteId.Dashboard);
            })
            .catch(() => this.messageService.showError(Translations.loginError, 'login_error'));
    }
}