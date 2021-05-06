import { StringU } from './Form';
import { Translations } from '../../app/translations';

export const hasValue = (value: any) => value != null && (typeof value !== 'string' ||  value) ? true : false;
export const required = (value: any) => hasValue(value) ? null : Translations.value_is_required;

const emailRegex = /\S+@\S+\.\S+/; 
// tslint:disable-next-line:max-line-length
const ulrRegex = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
export const isEmail = (value: StringU) => {
    if (value == null || emailRegex.test(value)) {
        return null;
    }

    return Translations.value_is_not_email;
};

export const isUrl = (value: StringU) => {
    if (value == null || ulrRegex.test(value)) {
        return null;
    }

    return Translations.value_is_not_url;
};