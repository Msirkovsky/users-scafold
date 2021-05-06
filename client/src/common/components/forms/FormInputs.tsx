import * as React from 'react';
import { action, observable, reaction, runInAction } from 'mobx';
import {
    Button, ButtonGroup, Checkbox, ControlLabel, FormControl,
    FormControlProps, FormGroup, FormGroupProps, Col, ColProps,
    Glyphicon, HelpBlock, InputGroup, Modal, Radio, Form as UIForm, ButtonProps, Sizes
} from 'react-bootstrap';
import { DropdownList, NumberPicker, SelectList, Multiselect, DateTimePicker } from 'react-widgets';
import { observer } from 'mobx-react';
import {
    Form, Field, SelectField, ListSelectField, MultiselectFetchFn
    , MultiselectField, DropdownField, FormDropdownFetchFn, StringU, DateU, NumberU
} from '../../forms';
import { ReactNode } from 'react';
import { SpinnerSpan } from '../common';
import classNames from 'classnames';

const getValidationState = (error: String | null, isValidating: boolean) => {
    if (error) {
        return 'error';
    } else if (isValidating) {
        return 'warning';
    }

    return undefined;
};

type LabelType = 'label' | 'placeholder' | 'none';

interface IDefaults {
    labelStyle: LabelType;
    horizontalForm: boolean;
    labelCols?: ColProps;
    inputCols?: ColProps;
    checkboxCols?: ColProps;
}

let defaults: IDefaults = {
    labelStyle: 'label',
    horizontalForm: false
};

export const setDefaults = (formDefaults: IDefaults) => {
    defaults = formDefaults;
};

type formattingFunction = (item: any) => string;

export interface ICommonFormInputProps {
    labelType?: LabelType;
    labelCols?: ColProps;
    inputCols?: ColProps;
}

type InputTypeType = 'text' | 'number' | 'email' | 'tel' | 'url' | 'password' | 'textarea';

const wrapInCol = (colProps: ColProps | undefined, element: React.ReactElement<any> | false) => {
    if (colProps == null) {
        return element;
    }

    return <Col {...colProps}>{element}</Col>;
};

interface IFormInputProps extends ICommonFormInputProps {
    field: Field<StringU> | Field<string>;
    type?: InputTypeType;
    autocomplete?: string;
    maxLength?: number;
    min?: number;
    max?: number;
    rows?: number;
    formControlProps?: FormControlProps;
    onFocus?: (e: any) => void | undefined;
    onBlur?: (e: any) => void | undefined;
}

@observer
export class FormInput extends React.Component<IFormInputProps, {}> {
    render() {
        const { field: { value, setValue, label, key, error, isValidating, isDisabled },
            type = 'text',
            rows,
            maxLength,
            labelType = defaults.labelStyle,
            formControlProps,
            labelCols = defaults.labelCols,
            inputCols = defaults.inputCols,
            autocomplete,
            onFocus,
            onBlur,
        } = this.props;
        
        return (
            <FormGroup validationState={getValidationState(error, isValidating)}>
                {wrapInCol(labelCols, labelType === 'label' && <ControlLabel>{label}</ControlLabel>)}
                {
                    wrapInCol(
                        inputCols,
                        <FormControl
                            {...formControlProps}
                            type={type}
                            name={key}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            value={value ? value : ''}
                            onChange={(e: any) => (setValue as any)(e.target.value)}
                            disabled={isDisabled}
                            placeholder={labelType === 'placeholder' ? label : undefined}
                            maxLength={maxLength}
                            rows={rows}
                            componentClass={type === 'textarea' ? 'textarea' : undefined}
                            autoComplete={autocomplete}
                        />)
                }
                {isValidating && <FormControl.Feedback><Glyphicon glyph="hourglass" /></FormControl.Feedback>}
                {error && <HelpBlock>{error}</HelpBlock>}
            </FormGroup>
        );
    }
}

interface ISimpleFormInputProps {
    field: Field<StringU> | Field<string>;
    type?: InputTypeType;
    maxLength?: number;
    min?: number;
    max?: number;
    rows?: number;
    formControlProps?: FormControlProps;
}

@observer
export class SimpleFormInput extends React.Component<ISimpleFormInputProps, {}> {
    render() {
        const { field: { value, setValue, label, key, error, isValidating, isDisabled },
            type = 'text',
            rows,
            maxLength,
            formControlProps,
        } = this.props;
        return (
            <FormControl
                {...formControlProps}
                type={type}
                name={key}
                value={value ? value : ''}
                onChange={(e: any) => (setValue as any)(e.target.value)}
                disabled={isDisabled}
                maxLength={maxLength}
                rows={rows}
                componentClass={type === 'textarea' ? 'textarea' : undefined}
            />
        );
    }
}

interface IFormNumberInputProps extends ICommonFormInputProps {
    field: Field<NumberU> | Field<number>;
    min?: number;
    max?: number;
}

@observer
export class FormNumberInput extends React.Component<IFormNumberInputProps, {}> {
    render() {
        const { field: { value, setValue, label, error, isValidating, isDisabled },
            labelType = defaults.labelStyle,
            min,
            max,
            labelCols = defaults.labelCols,
            inputCols = defaults.inputCols
        } = this.props;
        return (
            <FormGroup validationState={getValidationState(error, isValidating)}>
                {wrapInCol(labelCols, labelType === 'label' && <ControlLabel>{label}</ControlLabel>)}
                {
                    wrapInCol(
                        inputCols,
                        <NumberPicker
                            value={value}
                            onChange={(v) => (setValue as any)(v)}
                            disabled={isDisabled}
                            min={min}
                            max={max}
                            placeholder={labelType === 'placeholder' ? label : undefined}
                        />)
                }
                {isValidating && <FormControl.Feedback><Glyphicon glyph="hourglass" /></FormControl.Feedback>}
                {error && <HelpBlock>{error}</HelpBlock>}
            </FormGroup>
        );
    }
}

interface IFormComboboxProps extends ICommonFormInputProps {
    field: SelectField<any, any>;
    valueField: string;
    textField: string;
}

@observer
export class FormCombobox extends React.Component<IFormComboboxProps, {}> {
    render() {
        const {
            field: { value, setValue, items, label, error, isValidating, isDisabled },
            labelType = defaults.labelStyle,
            valueField,
            textField,
            labelCols = defaults.labelCols,
            inputCols = defaults.inputCols
        } = this.props;

        const itemsAsArray = items.slice();
        return (
            <FormGroup validationState={getValidationState(error, isValidating)}>
                {wrapInCol(labelCols, labelType === 'label' && <ControlLabel>{label}</ControlLabel>)}
                {wrapInCol(
                    inputCols,
                    <DropdownList
                        data={itemsAsArray}
                        valueField={valueField}
                        textField={textField}
                        value={value}
                        filter={false}
                        onChange={(item) => setValue(item[valueField])}
                        disabled={isDisabled}
                        placeholder={labelType === 'placeholder' ? label : undefined}
                    />)
                }
                {error && <HelpBlock>{error}</HelpBlock>}
            </FormGroup>
        );
    }
}

interface ISimpleFormComboboxProps {
    field: SelectField<any, any>;
    valueField: string;
    textField: string;
    className?: string;
    valueComponent?: any;
    itemComponent?: any;
    keyShortcuts?: any;
}

@observer
export class SimpleFormCombobox extends React.Component<ISimpleFormComboboxProps, {}> {
    constructor(props: ISimpleFormComboboxProps) {
        super(props);
    }
    render() {
        const {
            field: { value, setValue, items, label, error, isValidating, isDisabled },
            valueField,
            textField,
            className,
            valueComponent, 
            itemComponent,
            keyShortcuts,
        } = this.props;

        const itemsAsArray = items.slice();
        
        return (
            <DropdownList
                onKeyPress={keyShortcuts}
                data={itemsAsArray}
                valueField={valueField}
                textField={textField}
                value={value}
                filter={false}
                onChange={(item) => setValue(item[valueField])}
                disabled={isDisabled}
                className={className}
                valueComponent={valueComponent}
                itemComponent={itemComponent}
            />
        );
    }
}

interface IFormComboboxWithButtonProps extends IFormComboboxProps {
    button: any;
}

@observer
export class FormComboboxWithButton extends React.Component<IFormComboboxWithButtonProps, {}> {
    render() {
        const {
            field: { value, setValue, items, label, error, isValidating, isDisabled },
            labelType = defaults.labelStyle,
            valueField,
            textField,
            button,
            labelCols = defaults.labelCols,
            inputCols = defaults.inputCols
        } = this.props;
        return (
            <FormGroup validationState={getValidationState(error, isValidating)}>
                <InputGroup>
                    <InputGroup.Button>
                        {button}
                    </InputGroup.Button>
                    <DropdownList
                        data={items}
                        valueField={valueField}
                        textField={textField}
                        value={value}
                        filter={false}
                        onChange={(item) => setValue(item[valueField])}
                        disabled={isDisabled}
                        placeholder={labelType === 'placeholder' ? label : undefined}
                        className="form-control"
                    />
                </InputGroup>
                {error && <HelpBlock>{error}</HelpBlock>}
            </FormGroup>
        );
    }
}

interface IFormCheckboxProps extends ICommonFormInputProps {
    field: Field<boolean>;
    formGroupProps?: FormGroupProps;
}

@observer
export class FormCheckbox extends React.Component<IFormCheckboxProps, {}> {
    render() {
        const {
            field: { value, setValue, label, error, isValidating, isDisabled },
            labelType = defaults.labelStyle,
            formGroupProps,
            inputCols = defaults.checkboxCols
        } = this.props;
        return (
            <FormGroup {...formGroupProps} validationState={getValidationState(error, isValidating)}>
                {
                    wrapInCol(
                        inputCols,
                        <Checkbox checked={value} onChange={(e) => setValue(!value)} disabled={isDisabled}>
                            {(labelType === 'label' || labelType === 'placeholder') && label}
                        </Checkbox>
                    )
                }
                {isValidating && <FormControl.Feedback><Glyphicon glyph="hourglass" /></FormControl.Feedback>}{error && <HelpBlock>{error}</HelpBlock>}
            </FormGroup>
        );
    }
}

interface ISimpleFormCheckboxProps {
    field: Field<boolean>;
}

@observer
export class SimpleFormCheckbox extends React.Component<ISimpleFormCheckboxProps, {}> {
    render() {
        const {
            field: { value, setValue, label, error, isValidating, isDisabled }
        } = this.props;
        return (
            <Checkbox checked={value} onChange={(e) => setValue(!value)} disabled={isDisabled}/>
        );
    }
}

interface IFormSelectListProps extends ICommonFormInputProps {
    field: ListSelectField<any, any>;
    valueField: string;
    textField: string;
    className?: string;
    multiple: boolean;
}

@observer
export class FormSelectList extends React.Component<IFormSelectListProps, {}> {
    render() {
        const {
            field: { value, items, setValue, label, error, isValidating, isDisabled },
            labelType = defaults.labelStyle,
            valueField,
            textField,
            multiple,
            labelCols = defaults.labelCols,
            inputCols = defaults.inputCols,
            className
        } = this.props;
        return (
            <FormGroup validationState={getValidationState(error, isValidating)}>
                {wrapInCol(labelCols, labelType === 'label' && <ControlLabel>{label}</ControlLabel>)}
                {wrapInCol(
                    inputCols,
                    <SelectList
                        className={className}
                        data={items.slice()}
                        valueField={valueField}
                        textField={textField}
                        value={value}
                        onChange={(newValue) => multiple ? setValue(newValue.map(item => item[valueField])) : setValue(newValue[valueField])}
                        disabled={isDisabled}
                        multiple={multiple}
                    />)
                }
                {isValidating && <FormControl.Feedback><Glyphicon glyph="hourglass" /></FormControl.Feedback>}
                {error && <HelpBlock>{error}</HelpBlock>}
            </FormGroup>
        );
    }
}

class MultiselectState {
    @observable busy: boolean = false;
    @observable actualFilter: string | undefined;
    @observable.ref rowData: Array<any> = [];
    @observable isOpened: boolean = false;
    private actualPromise: any;
    constructor(initialRowData: any[], private getFetchFn: () => MultiselectFetchFn<any>) {
        this.actualFilter = '';
        this.rowData = initialRowData;

        reaction(
            () => this.actualFilter,
            (filter) => this.callFetch(),
            { delay: 300 }
        );

        reaction(
            () => this.isOpened,
            (isOpened) => {
                if (isOpened) {
                    this.callFetch();
                }
            }
        );
    }

    @action setRowData = (rowData: any[]) => {
        this.rowData = rowData;
    }

    @action setFilter(filter: string | undefined) {
        if (this.isOpened) {
            this.actualFilter = filter;
        }
    }

    @action setIsOpened(isOpened: boolean) {
        this.isOpened = isOpened;
    }

    @action callFetch = () => {
        this.busy = true;
        const promise = this.getFetchFn()(this.actualFilter);
        this.actualPromise = promise;

        promise.then((data) => {
            if (promise === this.actualPromise) {
                runInAction(() => {
                    this.setRowData(data);
                    this.busy = false;
                });
            }
        });
    }
}

interface FormMultiselectProps extends ICommonFormInputProps {
    field: MultiselectField<any, any>;
    valueField: string;
    textField: string | formattingFunction;
}

@observer
export class FormMultiselect extends React.Component<FormMultiselectProps, {}> {
    private data: MultiselectState;

    constructor(props: FormMultiselectProps) {
        super(props);
        this.data =
            new MultiselectState(props.field.initialItems, this.getTextFn);
    }

    render() {
        const { field: { value, setValue, label, error, isValidating, isDisabled },
            textField,
            valueField,
            labelType = defaults.labelStyle,
            labelCols = defaults.labelCols,
            inputCols = defaults.inputCols
        } = this.props;
        return (
            <FormGroup validationState={getValidationState(error, isValidating)}>
                {wrapInCol(labelCols, labelType === 'label' && <ControlLabel>{label}</ControlLabel>)}
                {wrapInCol(
                    inputCols,
                    <Multiselect
                        data={this.data.rowData}
                        searchTerm={this.data.actualFilter}
                        onSearch={(val) => this.data.setFilter(val)}
                        value={value}
                        onChange={(items) => setValue(items.map(item => item[valueField]))}
                        valueField={valueField}
                        textField={textField}
                        busy={this.data.busy}
                        onToggle={(isOpened) => {
                            this.data.setIsOpened(isOpened);
                        }}
                        disabled={isDisabled}
                        placeholder={labelType === 'placeholder' ? label : undefined}
                    />)
                }
                {isValidating && <FormControl.Feedback><Glyphicon glyph="hourglass" /></FormControl.Feedback>}
                {error && <HelpBlock>{error}</HelpBlock>}
            </FormGroup>
        );
    }

    private getTextFn = () => {
        return this.props.field.fetchFn;
    }
}

class DropdownData {
    @observable busy: boolean = false;
    @observable actualFilter: StringU;
    @observable.ref rowData: Array<any> = [];
    @observable isOpened: boolean = false;
    private actualPromise: any;
    constructor(initialData: any[], public fetchFn: FormDropdownFetchFn<any> | undefined = undefined) {
        this.rowData = initialData;

        reaction(
            () => this.actualFilter,
            (filter) => {
                if (this.isOpened) {
                    this.callFetch();
                }
            },
            { delay: 300 }
        );

        reaction(
            () => this.isOpened,
            (isOpened) => {
                if (isOpened) {
                    this.callFetch();
                }
            }
        );
    }

    @action setRowData = (rowData: any[]) => {
        this.rowData = rowData;
    }

    @action setFilter(filter: string | undefined) {
        if (this.isOpened) {
            this.actualFilter = filter;
        }
    }

    @action setIsOpened(isOpened: boolean) {
        this.isOpened = isOpened;
    }

    @action callFetch = () => {
        if (this.fetchFn != null) {
            this.busy = true;
            const promise = this.fetchFn(this.actualFilter);
            this.actualPromise = promise;

            promise.then((data) => {
                if (promise === this.actualPromise) {
                    runInAction(() => {
                        this.setRowData(data);
                        this.busy = false;
                    });
                }
            });
        }
    }
}

interface FormDropdownProps extends ICommonFormInputProps {
    field: DropdownField<any, any>;
    valueField: string;
    textField: string | formattingFunction;
}

@observer
export class FormDropdown extends React.Component<FormDropdownProps, {}> {
    private data: DropdownData;

    constructor(props: FormDropdownProps) {
        super(props);
        this.data = new DropdownData(props.field.initialItems, this.props.field.fetchFn);
    }

    render() {
        const { field: { value, setValue, setSelectedItem, label, error, isValidating, isDisabled },
            textField,
            valueField,
            labelType = defaults.labelStyle,
            labelCols = defaults.labelCols,
            inputCols = defaults.inputCols
        } = this.props;
        return (
            <FormGroup validationState={getValidationState(error, isValidating)}>
                {wrapInCol(labelCols, labelType === 'label' && <ControlLabel>{label}</ControlLabel>)}
                {wrapInCol(
                    inputCols,
                    <DropdownList
                        data={this.data.rowData}
                        searchTerm={this.data.actualFilter}
                        onSearch={(val) => this.data.setFilter(val)}
                        value={value}
                        onChange={(item) => {
                            setSelectedItem(item);
                            setValue(item[valueField]);
                        }}
                        filter={this.data.fetchFn == null ? 'contains' : false}
                        valueField={valueField}
                        textField={textField}
                        busy={this.data.busy}
                        onToggle={(isOpened) => {
                            this.data.setIsOpened(isOpened);
                        }}
                        disabled={isDisabled}
                        placeholder={labelType === 'placeholder' ? label : undefined}
                    />)
                }
                {isValidating && <FormControl.Feedback><Glyphicon glyph="hourglass" /></FormControl.Feedback>}
                {error && <HelpBlock>{error}</HelpBlock>}
            </FormGroup>
        );
    }

}

interface FormDatePickerProps extends ICommonFormInputProps {
    field: Field<DateU> | Field<Date>;
    time?: boolean;
    date?: boolean;
    step?: number;
    format?: string;
}

@observer
export class FormDatePicker extends React.Component<FormDatePickerProps, {}> {
    render() {
        const {
            field: { value, setValue, label, error, isValidating, isDisabled },
            time = false,
            date = true,
            step = 15,
            labelType = defaults.labelStyle,
            labelCols = defaults.labelCols,
            inputCols = defaults.inputCols
        } = this.props;
        let format = this.props.format;
        if (format == null) {
            if (date && time) {
                format = 'D.M.Y HH:mm';
            } else if (date) {
                format = 'D.M.Y';
            } else {
                format = 'HH:mm';
            }
        }

        return (
            <FormGroup validationState={getValidationState(error, isValidating)}>
                {wrapInCol(labelCols, labelType === 'label' && <ControlLabel>{label}</ControlLabel>)}
                {wrapInCol(
                    inputCols,
                    <DateTimePicker
                        value={value}
                        onChange={(selectedDate) => (setValue as any)(selectedDate)}
                        time={time}
                        date={date}
                        step={step}
                        format={format}
                        disabled={isDisabled}
                        placeholder={labelType === 'placeholder' ? label : undefined}
                    />)
                }
                {isValidating && <FormControl.Feedback><Glyphicon glyph="hourglass" /></FormControl.Feedback>}
                {error && <HelpBlock>{error}</HelpBlock>}
            </FormGroup>
        );
    }
}

interface IFormOverlayProps extends React.Props<FormOverlay> {
    form: Form;
    cancelFn?: () => void;
    horizontal?: boolean;
}

@observer
export class FormOverlay extends React.Component<IFormOverlayProps, {}> {
    render() {
        const { form, form: { _status: { submit, cancel, isPristine, isTouched, isSubmitting } }, horizontal = defaults.horizontalForm, children } = this.props;
        return (
            <div>
                <div className={isPristine ? undefined : 'modal-overlay'} />
                <div className="modal-overlay-content">
                    <UIForm horizontal={true}>
                        {children}
                    </UIForm>
                </div>
                {
                    isTouched &&
                    <div className="modal-overlay-buttons">
                        {cancel !== undefined && <Button key="cancelButton" onClick={cancel} bsSize="large" >Zrušit změny</Button>}
                        <Button
                            key="applyButton"
                            bsStyle="primary"
                            onClick={submit}
                            disabled={isSubmitting}
                            bsSize="large"
                            className="pull-right"
                        >
                            {isSubmitting === false ? 'Uložit' : 'Data se ukládají...'}
                        </Button>
                    </div>
                }
            </div>
        );
    }
}

interface FormButtonProps {
    bsClass?: string;
    active?: boolean;
    block?: boolean;
    bsStyle?: string | null;
    bsSize?: Sizes;
    componentClass?: React.ReactType;
    disabled?: boolean;
    form: Form;
    children?: ReactNode | string;
    className?: string;
    style?: any;
}

@observer
export class FormButton extends React.Component<FormButtonProps> {
    render() {
        const {form, children, className, style, ...rest} = this.props;
        
        return (
            <Button style={style} className={className} onClick={form._status.submit} disabled={form._status.isSubmitting} {...rest}>
                {children}&nbsp;{form._status.isSubmitting ? <SpinnerSpan/> : null}
            </Button>
        );
    }
}

interface IconSelectProps {
    field: SelectField<any, any>;
    valueFn:  (item: any) => any;
    iconNameFn: (item: any) => string;
    className?: string;
}

@observer
export class IconSelect extends React.Component<IconSelectProps> {
    constructor(props: IconSelectProps) {
        super(props);
    }
    render() {
        const {
            field: { value, setValue, items, label, error, isValidating, isDisabled },
            valueFn,
            className = '',
            iconNameFn
        } = this.props;

        return (
            <div className={className}>
                {
                    items.map(item => {
                        const classes = classNames(
                            'material-icons  mad-clickable', 
                            iconNameFn(item), 
                            {'mad-colP': valueFn(item) === value}
                        );
                        return (
                            <i
                                key={valueFn(item)}
                                className={classes}
                                onClick={() => setValue(valueFn(item))}
                            >
                            {iconNameFn(item)}
                            </i>
                        );
                    })
                }
            </div>
        );
    }
}