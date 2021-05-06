import * as React from 'react';
import { Button, Form, Modal, Col } from 'react-bootstrap';
import { FormInput, FormButton, FormSelectList } from '../../../common/components/forms';
import { LoginStore, TypRegistrace } from './LoginStore';
import { observer } from 'mobx-react';
import { Translations } from '../../basicTypes';

interface LoginComponentProps {
    store: LoginStore;
}

@observer
export class LoginComponent extends React.Component<LoginComponentProps> {
    render() {
        const { 
            store: {
                form,
                form: { username, password},                
                passwordResetForm                
            }
        } = this.props;

        let elementToShow: JSX.Element | null = null;
        if (passwordResetForm != null) {
            const passwordResetUsername = passwordResetForm.username;
            elementToShow = <FormInput field={passwordResetUsername} type="text" autocomplete="username"/>;
        } else {
            elementToShow =  (
                <>
                    <FormInput field={username} type="text" autocomplete="username"/>
                    <FormInput field={password} type="password" autocomplete="current-password"/>                    
                </>
            );
        }

        return (
            <Form horizontal={true}>
                <Modal.Dialog>
                    <Modal.Body >
                    {elementToShow}
                    </Modal.Body>
                    {
                        
                            <Modal.Footer>                                
                                {   passwordResetForm != null 
                                    ? <FormButton form={passwordResetForm} bsStyle="primary">{Translations.requestNewPassword}</FormButton>
                                    : <FormButton form={form} bsStyle="primary">{Translations.login}</FormButton>
                                }
                     
                            </Modal.Footer>
                        
                    }
                </Modal.Dialog>
            </Form>
        );
    }
}