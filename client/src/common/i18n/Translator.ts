import { observable, action, computed } from 'mobx';

export class TranslationText {
    @observable text!: String;
    key: string;
    constructor(text: String, key: string) {
        this.setText(text);
        this.key = key;
    }
    @action setText = (text: String) => {
        // tslint:disable-next-line:no-construct
        this.text = new String(text);
        (this.text as any).translationText = this;
    }
}

interface ILanguageTranslations<TranslationObject> {
    language: string;
    translations: TranslationObject;
}

export class Translator<TranslationObject> {
    translations: Map<string, TranslationObject> = new Map();
        
    private translationObject: any;
    private rawTranslationObject: any;

    constructor(languages: ILanguageTranslations<TranslationObject>[]) {
        languages.forEach(translation => this.translations.set(translation.language, translation.translations));
        this.rawTranslationObject = {};
        this.translationObject = {};
        this.translationObject.__observableTranslations = this.rawTranslationObject;

        const defaultTranslations = languages[0].translations;
        for (var key in defaultTranslations) {
            if (defaultTranslations.hasOwnProperty(key)) {
                var value = defaultTranslations[key];
                const translationText = new TranslationText(value as any, key);
                this.rawTranslationObject[key] = translationText;
                Object.defineProperty(this.translationObject, key, {
                    get: () => translationText.text
                });
            }
        }
    }

    getTranslationObject = () => {
        return this.translationObject as TranslationObject;
    }

    setCurrentLanguage = (language: string) => {
        const newTranslations = this.translations.get(language);
        if (newTranslations == null) {
            throw new Error(`Translations for language ${language} are not registered`);
        }

        for (var key in newTranslations) {
            if (newTranslations.hasOwnProperty(key)) {
                var value = newTranslations[key];
                this.rawTranslationObject[key].setText(value);
            }
        }
    }

}