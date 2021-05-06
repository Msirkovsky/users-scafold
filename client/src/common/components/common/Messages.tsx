/*import * as React from 'react';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import { ProgressBar, Row, Col } from 'react-bootstrap';

export type MessageType = 'info' | 'warning' | 'error' | 'fatal-error';

export class Message {
    message: string;
    type: MessageType;
    autoDismiss: number | null;
    @observable timeLeft: number | null = null;

    constructor(type: MessageType, message: string,  autoDismiss: number | null = null) {
        this.message = message;
        this.type = type;
        this.autoDismiss = autoDismiss;
        this.timeLeft = autoDismiss;

    }
}

const mapMessageTypeToClassName = (messageType: string): string => {
    switch (messageType) {
        case 'info':
            return 'panel-info';
        case 'warning':
            return 'panel-yellow';
        case 'error':
            return 'panel-danger';
        case 'fatal-error':
            return 'panel-red';
        default:
            throw new Error(`Message type ${messageType} is not mapped to any class name`);
    }
};

const MessageRow = observer(({message}: {message: Message}) => {
    const autoDismiss = message.autoDismiss ? message.autoDismiss : 0;
    return (
        <Row>
            <Col xs={9} lg={10}>{message.message}</Col>
            <Col xs={3} lg={2}> 
                { message.timeLeft != null &&
                    <ProgressBar 
                        now={message.timeLeft + 1}
                        max={autoDismiss}
                        label={`${message.timeLeft + 1}s`} 
                        active 
                    />
                }
            </Col>
        </Row>);
});

const MessagePanel = observer(({messageClassName, messages}: { messageClassName: string, messages: Message[] }) => {
    let i = 0;
    return (
        <div className={'panel ' + messageClassName}>
            <div className="panel-heading"/>
            <div className="panel-body">
                {messages.map((m) => <MessageRow message={m} key={i++}/>)}
            </div>
        </div>);
});

export const MessagesComponent = observer(({store: {groupedMessages}}: MessagesProps) => {
    return (
        <div className="messages">
            {
                Array.from(groupedMessages).map((item) => { return (
                    <MessagePanel
                        key={item[0]}
                        messageClassName={mapMessageTypeToClassName(item[0])}
                        messages={item[1]}
                    />);
                })
            }
        </div>
    );
});*/
