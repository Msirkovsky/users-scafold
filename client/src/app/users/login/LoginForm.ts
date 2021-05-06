import { Field, Form, StringU, required } from '../../../common/forms';
import { Translations } from '../../translations';
export class LoginForm extends Form {
    username: Field<StringU>;
    password: Field<StringU>;
    constructor(onSubmit: (values: any) => void) {
        super(onSubmit);
        this.username = new Field<StringU>({
            label: Translations.username,
            value: '',
            validators: [required]
        });
        this.password = new Field<StringU>({
            label: Translations.password,
            value: '',
            validators: [required]
        });
    }
}