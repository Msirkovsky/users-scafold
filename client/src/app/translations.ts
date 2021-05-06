import { Translator } from '../common/i18n/Translator';

interface IStaticStrings {
    __invisibleText: string;
    language: string;
    username: string;
    password: string;
    noveInfo: string;
    value_is_required: string;
    value_is_not_email: string;
    value_is_not_url: string;
    ulozit: string;
    firstName: string;
    lastName: string;
    company: string;
    isActive: string;
    roles: string;
    telephone: string;
    lastLoginDate: string;
    name: string;    
    back: string;
    backToList: string;
    passwordChangeSuccess: string;
    passwordChangeTitle: string;
    forgottenPassword: string;
    requestNewPassword: string;
    users: string;    
    resetHesla: string;
    detailUzivatele: string;
    celeJmeno: string;
    usersList: string;
    ok: string;
    text: string;
    limit: string;
    email: string;
    login: string;
    loginError: string;
    save: string;
}

const cz: IStaticStrings = {
    
    __invisibleText: '',
    noveInfo: 'Nové informace',
    username: 'Uživatelské jméno',
    password: 'Heslo',
    value_is_required: 'Hodnota je povinná',
    email: 'Email',
    value_is_not_email: 'Hodnota není platný email',    
    value_is_not_url: 'Hodnota není platná URL adresa',
    company: 'Společnost',
    firstName: 'Jméno',
    isActive: 'Aktivní',
    lastLoginDate: 'Datum posledního přihlášení',
    lastName: 'Příjmení',
    roles: 'Role',
    telephone: 'Telefon',
    ulozit: 'Uložit',
    name: 'Název',
    back: 'Zpět',
    backToList: 'Zpět na seznam',
    passwordChangeSuccess: 'Změna hesla proběhla úspěšně. Můžete se přihlásit novým heslem',
    passwordChangeTitle: 'Pro obnovení hesla zadejte nové heslo',
    forgottenPassword: 'Zapomenuté heslo?',
    requestNewPassword: 'Požádat o nové heslo',
    users: 'Uživatelé',
    language: 'Jazyk',
    resetHesla: 'Reset hesla',
    detailUzivatele: 'Detail uživatele',
    celeJmeno: 'Celé jméno',
    usersList: 'Seznam uživatelů',
    ok: 'OK',
    text: 'text',
    limit: 'limit',
    login: 'Přihlásit se',
    loginError: 'Přihlašovací údaje nejsou správné',
    save: 'Uložit'
    
};

const translator = new Translator<IStaticStrings>(
    [
        {
            language: 'cz',
            translations: cz
        }        
    ]
);

export const Translations: IStaticStrings = translator.getTranslationObject();
export const switchToLanguage = translator.setCurrentLanguage;
