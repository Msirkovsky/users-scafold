import { observable, action, reaction, computed, when } from 'mobx';
import { TranslationText } from '../i18n/Translator';

export type FormattedErrorType = { key: string, params: any };
export type ValidationFunctionType<T> = (value: T) => String | null;
export type AsyncValidationFunctionType<T> = (value: T) => Promise<string | null>;

export type StringU = string | undefined | null;
export type NumberU = number | undefined | null;
export type DateU = Date | undefined | null;

interface IFieldSettings<FieldType> {
    label: String;
    value: FieldType;
    validators?: ValidationFunctionType<FieldType>[];
    dependand?: Field<any>[];
    asyncValidators?: AsyncValidationFunctionType<FieldType>[];
}

export class Field<FieldType> {
    validators: ValidationFunctionType<FieldType>[];
    asyncValidators: AsyncValidationFunctionType<FieldType>[];
    dependand: Field<any>[];
    toDispose: any[] = [];
    @observable.ref private _value: FieldType;
    @observable private _isTouched: boolean = false;
    @observable private _isDisabled: boolean = false;
    @observable private _isValid: boolean = true;
    @observable private _isValidating: boolean = false;
    private _key: string;
    private initialValue: FieldType;

    get value() {
        return this._value;
    }

    get key() {
        return this._key;
    }
    get isTouched() {
        return this._isTouched;
    }

    get isDisabled() {
        return this._isDisabled;
    }

    get isValid() {
        return this._isValid;
    }

    get isValidating() {
        return this._isValidating;
    }

    @computed get error(): string | null {
        if (this.observableError == null) {
            return null;
        }

        return this.observableError.translationText.text;
    }

    private observableLabel: TranslationText;
    @computed get label(): string {
        return this.observableLabel.text.valueOf();
    }

    @observable private observableError: any;

    private lastValidationPromiseToWait: Promise<any> | null = null;

    @action reset = () => {
        this.setValue(this.initialValue);
        this.setTouched(false);
    }

    constructor(fieldSettings: IFieldSettings<FieldType>) {
        const { value, validators = [], dependand = [], asyncValidators = [] } = fieldSettings;
        this.initialValue = value;
        this._value = value;
        const label: any = fieldSettings.label;
        if (label.translationText == null) {
            throw new Error(`Label ${label} has to be observable text. Use Translator.getTranslationObject() and properties of resulting object as labels`);
        }

        this.observableLabel = label.translationText;
        this._key = label.translationText.key;
        this.validators = validators;
        this.asyncValidators = asyncValidators;
        this.dependand = dependand;

        const validationReaction = reaction(
            () => this._value,
            (reactionValue) => {
                this.validate();
                for (let dependandField of this.dependand) {
                    dependandField.validate();
                }
            },
            { delay: 100 });
        this.toDispose.push(validationReaction);
    }

    @action setValue = (value: FieldType) => {
        this._value = value;
        this._isTouched = true;
    }

    @action commitActualValue = () => {
        this.initialValue = this._value;
        this.setTouched(false);
    }
    @action setTouched = (touched: boolean) => {
        this._isTouched = touched;
    }

    @action setDisabled = (disabled: boolean) => {
        this._isDisabled = disabled;
    }

    @action setIsValidating = (isValidating: boolean) => {
        this._isValidating = isValidating;
    }

    @action setError = (error: String | null) => {
        if (error == null) {
            this.observableError = null;
            this._isValid = true;
        } else {
            if ((error as any).translationText == null) {
                throw new Error('Error texts must be observable text. Use Translator.getTranslationObject() and properties of returned instance');
            }
            this.observableError = error;
            this._isValid = false;
        }
    }

    @action validate = () => {
        this.setIsValidating(false);
        this.lastValidationPromiseToWait = null;
        for (let validator of this.validators) {
            const result = validator(this._value);
            if (result != null) {
                this.setError(result);
                return;
            }
        }
        this.setError(null);

        if (this.asyncValidators.length > 0) {
            this.asyncValidate();
        }
    }

    dispose() {
        this.toDispose.forEach(disposer => disposer());
    }

    private asyncValidate = () => {
        this.setIsValidating(true);
        const validationPromise = Promise.all(this.asyncValidators.map(av => av(this._value)));
        this.lastValidationPromiseToWait = validationPromise;
        validationPromise.then(results => {
            if (validationPromise === this.lastValidationPromiseToWait) {
                const errors = results.filter(x => x != null);
                if (errors.length > 0) {
                    this.setError(errors.join(', '));
                } else {
                    this.setError(null);
                }

                this.setIsValidating(false);
            }
        }).catch((error) => {
            if (typeof error === 'string') {
                this.setError(error);
            } else {
                this.setError('Unknown error');
            }
            this.setIsValidating(false);
        });
    }
}

interface IComputedFieldSettings<FieldType> {
    computationFn: () => FieldType;
    label: String;
    validators?: ValidationFunctionType<FieldType>[];
    dependand?: Field<any>[];
    asyncValidators?: AsyncValidationFunctionType<FieldType>[];
}

export class ComputedField<FieldType> extends Field<FieldType> {
    get isComputed(): boolean {
        return true;
    }

    constructor(fieldSettings: IComputedFieldSettings<FieldType>) {
        const { computationFn, ...rest } = fieldSettings;
        super({ ...rest, value: computationFn() });
        this.setDisabled(true);
        const react = reaction(
            () => computationFn(),
            (computationResult) => this.setValue(computationResult)
        );

        this.toDispose.push(react);
    }
}

interface ISelectFieldSettings<FieldType, ItemType> extends IFieldSettings<FieldType> {
    items: ItemType[];
}
export class SelectField<FieldType, ItemType> extends Field<FieldType> {

    @observable.shallow items: ItemType[];

    constructor(fieldSettings: ISelectFieldSettings<FieldType, ItemType>) {
        super(fieldSettings);
        this.items = fieldSettings.items;
    }
}

export class ListSelectField<FieldType, ItemType> extends Field<FieldType> {
    items: ItemType[];

    constructor(fieldSettings: ISelectFieldSettings<FieldType, ItemType>) {
        super(fieldSettings);
        this.items = fieldSettings.items;
    }
}

export class FieldGroup {
    // tslint:disable-next-line:variable-name
    protected __status = new FieldGroupStatus(this);
    get _status() {
        return this.__status;
    }
}

export class FieldArray<FormFieldsType extends FieldGroup> {
    @observable.shallow items: FormFieldsType[];
    @observable isArrayModified: boolean = false;

    constructor(items: FormFieldsType[]) {
        this.items = items;
        reaction(
            () => this.items.length,
            () => this.isArrayModified = true
        );
    }

    @computed get isValid(): boolean {
        let valid = true;

        for (let fieldGroup of this.items) {
            valid = valid && fieldGroup._status.isValid;
        }

        return valid;
    }

    @computed get isValidating(): boolean {
        let validating = false;

        for (let fieldGroup of this.items) {
            validating = validating || fieldGroup._status.isValidating;
        }

        return validating;
    }

    @computed get isTouched(): boolean {
        let touched = false;
        if (this.isArrayModified) {
            return true;
        }

        for (let fieldGroup of this.items) {
            touched = touched || fieldGroup._status.isTouched;
            if (touched === true) {
                break;
            }
        }

        return touched;
    }

    @action commitActualValues = () => {
        this.isArrayModified = false;
        for (let fieldGroup of this.items) {
            fieldGroup._status.commitActualValues();
        }
    }

    @action setTouched = (touched: boolean) => {
        for (let fieldGroup of this.items) {
            fieldGroup._status.setTouched(touched);
        }
    }

    @action reset = () => {
        for (let fieldGroup of this.items) {
            fieldGroup._status.reset();
        }
    }

    @computed get isPristine(): boolean {
        return !this.isTouched;
    }

    @computed get isInvalid(): boolean {
        return !this.isValid;
    }

    getValues: () => any[] = () => {
        const valuesArray: any[] = [];
        for (let fieldGroup of this.items) {
            valuesArray.push(fieldGroup._status.getValue());
        }
        return valuesArray;
    }

    setDisabled = (disabled: boolean) => {
        for (let fieldGroup of this.items) {
            fieldGroup._status.setDisabled(disabled);
        }
    }

    validate = () => {
        for (let fieldGroup of this.items) {
            fieldGroup._status.validate();
        }
    }

    dispose = () => {
        for (let fieldGroup of this.items) {
            fieldGroup._status.dispose();
        }
    }
}

class FieldGroupStatus {
    @computed get isValid(): boolean {
        let valid = true;
        for (let field in this.fieldGroup) {
            if (this.fieldGroup.hasOwnProperty(field)) {
                const fieldValue: any = this.fieldGroup[field];
                if (fieldValue instanceof FieldGroup) {
                    valid = valid && fieldValue._status.isValid;
                } else if (fieldValue instanceof Field || fieldValue instanceof FieldArray) {
                    valid = valid && fieldValue.isValid;
                }
                if (!valid) {
                    return false;
                }
            }
        }
        return valid;
    }

    @computed get isValidating(): boolean {
        let validating = false;
        for (let field in this.fieldGroup) {
            if (this.fieldGroup.hasOwnProperty(field)) {
                const fieldValue: any = this.fieldGroup[field];
                if (fieldValue instanceof FieldGroup) {
                    validating = validating || fieldValue._status.isValidating;
                } else if (fieldValue instanceof Field || fieldValue instanceof FieldArray) {
                    validating = validating || fieldValue.isValidating;
                }
                if (validating) {
                    return true;
                }
            }
        }
        return validating;
    }

    @computed get isTouched(): boolean {
        let touched = false;

        for (let field in this.fieldGroup) {
            if (this.fieldGroup.hasOwnProperty(field)) {
                const fieldValue: any = this.fieldGroup[field];
                if (fieldValue instanceof FieldGroup) {
                    touched = touched || fieldValue._status.isTouched;
                } else if (fieldValue instanceof Field || fieldValue instanceof FieldArray) {
                    touched = touched || fieldValue.isTouched;
                }

                if (touched) {
                    return touched;
                }
            }
        }

        return touched;
    }

    @action setTouched = (touched: boolean) => {
        for (let field in this.fieldGroup) {
            if (this.fieldGroup.hasOwnProperty(field)) {
                const fieldValue: any = this.fieldGroup[field];
                if (fieldValue instanceof FieldGroup) {
                    fieldValue._status.setTouched(touched);
                } else if (fieldValue instanceof Field || fieldValue instanceof FieldArray) {
                    fieldValue.setTouched(touched);
                }
            }
        }
    }

    @action reset = () => {
        for (let field in this.fieldGroup) {
            if (this.fieldGroup.hasOwnProperty(field)) {
                const fieldValue: any = this.fieldGroup[field];
                if (fieldValue instanceof FieldGroup) {
                    fieldValue._status.reset();
                } else if (fieldValue instanceof Field || fieldValue instanceof FieldArray) {
                    fieldValue.reset();
                }
            }
        }
    }

    @action commitActualValues = () => {
        for (let field in this.fieldGroup) {
            if (this.fieldGroup.hasOwnProperty(field)) {
                const fieldValue: any = this.fieldGroup[field];
                if (fieldValue instanceof FieldGroup) {
                    fieldValue._status.commitActualValues();
                } else if (fieldValue instanceof Field) {
                    fieldValue.commitActualValue();
                } else if (fieldValue instanceof FieldArray) {
                    fieldValue.commitActualValues();
                }
            }
        }
    }

    @computed get isPristine(): boolean {
        return !this.isTouched;
    }

    @computed get isInvalid(): boolean {
        return !this.isValid;
    }

    getValue = (): any => {
        const groupValues: any = {};
        for (let field in this.fieldGroup) {
            if (this.fieldGroup.hasOwnProperty(field)) {
                const fieldValue: any = this.fieldGroup[field];
                if (fieldValue instanceof FieldGroup) {
                    groupValues[field] = fieldValue._status.getValue();
                } else if (fieldValue instanceof ComputedField) {
                    // do nothing
                } else if (fieldValue instanceof Field) {
                    groupValues[field] = fieldValue.value;
                } else if (fieldValue instanceof FieldArray) {
                    groupValues[field] = fieldValue.getValues();
                }
            }
        }
        return groupValues;
    }

    validate = () => {
        for (let field in this.fieldGroup) {
            if (this.fieldGroup.hasOwnProperty(field)) {
                const fieldValue: any = this.fieldGroup[field];
                if (fieldValue instanceof FieldGroup) {
                    fieldValue._status.validate();
                } else if (fieldValue instanceof Field || fieldValue instanceof FieldArray) {
                    fieldValue.validate();
                }
            }
        }
    }

    setDisabled = (disabled: boolean) => {
        for (let field in this.fieldGroup) {
            if (this.fieldGroup.hasOwnProperty(field)) {
                const fieldValue: any = this.fieldGroup[field];
                if (fieldValue instanceof FieldGroup) {
                    fieldValue._status.setDisabled(disabled);
                } else if (fieldValue instanceof ComputedField) {
                    // do nothing
                } else if (fieldValue instanceof Field || fieldValue instanceof FieldArray) {
                    fieldValue.setDisabled(disabled);
                }
            }
        }
    }

    dispose = () => {
        for (let field in this.fieldGroup) {
            if (this.fieldGroup.hasOwnProperty(field)) {
                const fieldValue: any = this.fieldGroup[field];
                if (fieldValue instanceof FieldGroup) {
                    fieldValue._status.dispose();
                } else if (fieldValue instanceof Field || fieldValue instanceof FieldArray) {
                    fieldValue.dispose();
                }
            }
        }
    }

    constructor(private fieldGroup: FieldGroup) {
    }

}

class FormStatus extends FieldGroupStatus {
    @observable isSubmitting: boolean = false;
    private cancel: (() => void) | undefined;

    constructor(
        private form: Form,
        private onSubmit: (values: any) => Promise<any> | void,
        cancel: (() => void) | undefined,
        private onError: () => void
    ) {
        super(form);
        if (cancel == null) {
            this.cancel = this.reset;
        } else {
            this.cancel = cancel;
        }
    }

    submit = () => {
        if (this.isSubmitting) {
            return; // no repeated submits
        }
        this.setIsSubmitting(true);

        this.validate();
        if (this.isValidating) {
            when(
                () => !this.isValidating,
                () => this.handleSubmitCallbacks()
            );
        } else {
            this.handleSubmitCallbacks();
        }
    }

    @action private setIsSubmitting(isSubmitting: boolean) {
        this.isSubmitting = isSubmitting;
    }

    private handleSubmitCallbacks = () => {
        if (this.isValid) {
            const retval = this.onSubmit(this.getValue());
            if (retval != null) {
                retval.then(
                    () => { this.setIsSubmitting(false); this.commitActualValues(); },
                    () => this.setIsSubmitting(false) // error message is displayed in http.service
                ).catch((e) => console.warn(e));
            } else {
                this.commitActualValues();
                this.setIsSubmitting(false);
            }
        } else {
            this.onError();
            this.setIsSubmitting(false);
        }
    }
}

export class Form extends FieldGroup {

    // tslint:disable-next-line:variable-name
    protected __status!: FormStatus;
    get _status() {
        return this.__status;
    }

    constructor(
        onSubmit: (values: any) => Promise<any> | void = () => { return; },
        cancel: (() => void) | undefined = undefined,
        onError: () => void = () => ({})
    ) {
        super();
        this.__status = new FormStatus(this, onSubmit, cancel, onError);
    }

}

export type MultiselectFetchFn<T> = (filter: string | undefined) => Promise<Array<T>>;

interface IMultiselectFieldSettings<FieldType, ItemType> extends IFieldSettings<FieldType> {
    initialItems: ItemType[];
    fetchFn: MultiselectFetchFn<ItemType>;
}

export class MultiselectField<FieldType extends Array<any>, ItemType> extends Field<FieldType> {

    initialItems: ItemType[];
    fetchFn: MultiselectFetchFn<ItemType>;

    constructor(fieldSettings: IMultiselectFieldSettings<FieldType, ItemType>) {
        super(fieldSettings);
        this.fetchFn = fieldSettings.fetchFn;
        this.initialItems = fieldSettings.initialItems;
    }
}

export type FormDropdownFetchFn<T> = (filter: StringU) => Promise<Array<T>>;

interface FormDropdownFieldSettings<FieldType, ItemType> extends IFieldSettings<FieldType> {
    initialItems: ItemType[];
    fetchFn?: FormDropdownFetchFn<ItemType>;
}

export class DropdownField<FieldType, ItemType> extends Field<FieldType> {

    initialItems: ItemType[];
    fetchFn?: FormDropdownFetchFn<ItemType>;
    @observable.ref selectedItem: ItemType | undefined;

    constructor(fieldSettings: FormDropdownFieldSettings<FieldType, ItemType>) {
        super(fieldSettings);
        this.initialItems = fieldSettings.initialItems;
        this.fetchFn = fieldSettings.fetchFn;
    }
    @action setSelectedItem = (selectedItem: ItemType | undefined) => {
        this.selectedItem = selectedItem;
    }
}

export type FetchItemsType = (text: StringU) => Promise<Array<string>>;

interface IAutocompleteFieldSettings extends IFieldSettings<StringU> {
    fetchItems: FetchItemsType;
}

export class AutocompleteField extends Field<StringU> {

    @observable.shallow items: Array<string> = [];
    @observable isLoading: boolean = false;
    lastPromiseToWait: any = null;
    private fetchItemsFn: FetchItemsType;
    constructor(fieldSettings: IAutocompleteFieldSettings) {
        super(fieldSettings);
        this.fetchItemsFn = fieldSettings.fetchItems;
        reaction(
            () => this.value,
            (value) => this.fetchItems(value)
        );
    }

    @action setItems = (items: Array<string>) => {
        this.items = items;
        this.isLoading = false;
        this.lastPromiseToWait = null;
    }

    @action fetchItems = (filter: StringU) => {
        if (filter === undefined || filter === '') {
            this.setItems([]);
        } else {
            const actualPromise = this.fetchItemsFn(filter);
            this.lastPromiseToWait = actualPromise;
            this.isLoading = true;
            actualPromise.then((items) => {
                if (actualPromise === this.lastPromiseToWait) {
                    this.setItems(items);
                }
            });
        }
    }
}