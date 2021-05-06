import { Form,  Field, ListSelectField,  required, isEmail } from '../../../common/forms';
import { UserEditModel, Role } from '../../../generated/Models';
import { computed } from 'mobx';
import { Translations } from '../../basicTypes';

export class UserDetailForm extends Form {
    firstName: Field<string>;
    lastName: Field<string>;
    email: Field<string>;
    telephone: Field<string>;
    isActive: Field<boolean>;
    roles: ListSelectField<Array<number>, Role>;    

    @computed get isOperator(): boolean {
        return this.roles.value.some(role => role === 3);
    }
    @computed get isProhlizitel(): boolean {
        return this.roles.value.some(role => role === 4);
    }
    @computed get isZadatel(): boolean {
        return this.roles.value.some(role => role === 5);
    }

    constructor(
        user: UserEditModel,
        onSubmit: (formValues: any) => void,
    ) {
        super(onSubmit);
        const userDetail = user.entity;
        this.firstName = new Field<string>({
            label: Translations.firstName,
            value: userDetail.firstName,
            validators: [required]
        });
        this.lastName = new Field<string>({
            label: Translations.lastName,
            value: userDetail.lastName,
            validators: [required]
        });
        this.email = new Field<string>({
            label: Translations.email,
            value: userDetail.email,
            validators: [required, isEmail]
        });
        
        this.telephone = new Field<string>({
            label: Translations.telephone,
            value: userDetail.telephone,
            validators: [required]
        });
        this.isActive = new Field<boolean>({
            label: Translations.isActive,
            value: userDetail.isActive
        });
        this.roles = new ListSelectField<Array<number>, Role>({
            label: Translations.roles,
            value: user.entity.roles,
            items: user.datasource.roles
        });
        
    }
}