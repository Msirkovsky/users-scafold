export class MessageService {
    private errorUID = '___systemStandardError';
    private notificationComponent: any;
    
    setNotificationComponent(notificationComponent: any) {
        this.notificationComponent = notificationComponent;
    }

    showInfo = (message: string) => {
        this.notificationComponent.addNotification(
            {title: 'Informace', dismissible: true, autoDismiss: 5, message: message, level: 'info', position: 'tc'}
        );
    }

    showError = (message: string, uid?: string) => {
        if (!uid) {
            uid = this.errorUID;
        }
        this.notificationComponent.addNotification(
            {uid: uid, title: 'Chyba', dismissible: true, autoDismiss: 10, message: message, level: 'error', position: 'tc'}
        );
    }
    showErrorWithTitle = (message: string, title: string, uid?: string) => {

        if (!uid) {
            uid = this.errorUID;
        }
        
        this.notificationComponent.addNotification(
            {uid: uid, title: title, dismissible: true, autoDismiss: 10, message: message, level: 'error', position: 'tc'}
        );
    }

    showSuccess = (message: string) => {

        // ensure removing error message
        this.notificationComponent.removeNotification(this.errorUID);

        this.notificationComponent.addNotification(
            {title: 'OK', dismissible: true, autoDismiss: 5, message: message, level: 'success', position: 'tc'}
        );
    }
    showWarning = (message: string) => {
        this.notificationComponent.addNotification(
            {title: 'Upozornění', dismissible: true, autoDismiss: 5, message: message, level: 'warning', position: 'tc'}
        );
    }

    hideMessage = (uid: string) => {
        this.notificationComponent.removeNotification(uid);
    }

}