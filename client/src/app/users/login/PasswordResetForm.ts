import { Field, Form, StringU, required } from '../../../common/forms';
import { Translations } from '../../translations';
export class PasswordResetForm extends Form {
    username: Field<StringU>;
    constructor(onSubmit: (values: any) => void, username: StringU) {
        super(onSubmit);
        this.username = new Field<StringU>({
            label: Translations.username,
            value: username,
            validators: [required]
        });
    }
}