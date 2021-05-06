import * as React from 'react';
import { Layout } from './routing/components/Layout';
import { MainState } from './app/MainState';
import { Router } from './routing/components/Router';
import * as NotificationSystem from 'react-notification-system';
import { setDefaults } from './common/components/forms/FormInputs';

setDefaults({
    labelStyle: 'label',
    horizontalForm: false,
    inputCols: {xs: 12},
    labelCols: {xs: 12},
    checkboxCols: {xs: 8, xsOffset: 4}
});

const defaultColors = {
    success: {
        rgb: '94, 164, 0',
        hex: '#5ea400'
    },
    error: {
        rgb: '236, 61, 61',
        hex: '#ec3d3d'
    },
    warning: {
        rgb: '235, 173, 23',
        hex: '#ebad1a'
    },
    info: {
        rgb: '54, 156, 199',
        hex: '#369cc7'
    }
};

var notificationsStyle = {
    
    Containers: {
        DefaultStyle: {
            
        }
     },
    NotificationItem: { // Override the notification item
        DefaultStyle: { // Applied to every notification, regardless of the notification level
            padding: 10,
            fontSize: 12,
            width: '570px'
        },
        success: {
            borderTop: '8px solid ' + defaultColors.success.hex
        },
        info: {
            borderTop: '8px solid ' + defaultColors.info.hex
        },
        error: {
            borderTop: '8px solid ' + defaultColors.error.hex
        }
    },
    Title: {
        DefaultStyle: {
            fontSize: 15
        }
    }
};

interface IAppProps {
    mainState: MainState;
}

export class App extends React.Component<IAppProps, {}> {

    constructor(props: IAppProps) {
        super(props);
    }

    render() {

        return (
            <div>
                <Router layout={Layout} routerState={this.props.mainState.routingState} />
                <NotificationSystem ref={this.setNotificationComponent} style={notificationsStyle} />
            </div>
        );
    }
    
    private setNotificationComponent = (notificationComponent: any) => {
        if (!notificationComponent) {
            return;
        }
        this.props.mainState.setNotificationComponent(notificationComponent);
        // const hmrActiveStr = localStorage.getItem('hmr_active');
        // const hmrActive = hmrActiveStr === 'true';
        // notificationComponent.addNotification(
        //     {
        //         title: 'Info',
        //         dismissible: true,
        //         autoDismiss: 5,
        //         message: 'HMR is ' + (hmrActive ? 'active' : 'disabled'),
        //         level: (hmrActive ? 'success' : 'warning'), position: 'br'
        //     }
        // );
        
    }

}