import * as React from 'react';
import { Button,  Clearfix, Col, Row } from 'react-bootstrap';
import { FormButton, FormCheckbox, FormInput, FormSelectList, FormMultiselect, FormOverlay, FormDatePicker } from '../../../common/components/forms';
import { observer } from 'mobx-react';
import { UserDetailStore } from './UserDetailStore';
import { Translations } from '../../basicTypes';

interface IUserDetailProps {
    store: UserDetailStore;
}

export const UserDetail = observer(
    ({ store, store: { form } }: IUserDetailProps) => {
        return (
            <>
                <Button className="btn-form" onClick={store.navigateToList}>{Translations.backToList}</Button>
                <FormButton form={form}>{Translations.save}</FormButton>
                <Button className="btn-form" onClick={store.resetPassword}>{Translations.resetHesla}</Button>
                <h1>{Translations.detailUzivatele}</h1>
                <Row>
                    <Col xs={12} md={4}>
                        <FormInput field={form.email} type="email"/>
                        <FormInput field={form.firstName} />
                        <FormInput field={form.lastName} />
                        <FormInput field={form.telephone} type="tel" />
                    </Col>
                    <Col xs={12} md={4}>
                        <FormSelectList field={form.roles} valueField="id" textField="caption" multiple={true} labelCols={{md: 2}} className=""/>
                        <FormCheckbox inputCols={{xsOffset: 0, xs: 12}} field={form.isActive} />
                    </Col>
                    <Clearfix />
                    
                </Row>                                    
            </>
        );
    }
);