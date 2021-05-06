import * as React from 'react';
import { DashboardStore } from './DashboardStore';
import { RouteId } from '../routes';
import { Translations } from '../basicTypes';
import { DashboardTile } from './DashboardTile';

interface IDashboardProps {
    store: DashboardStore;
}

export class Dashboard extends React.Component<IDashboardProps, {}> {
    render() {
        const { store: {navigateTo, mainState} } = this.props;
        const userInfo = mainState.userInfo;                
        return (
            <div>
                <DashboardTile 
                    cssClass="base-request-tile users-tile" 
                    title={Translations.users}
                    onClick={() => navigateTo(RouteId.UsersList)} 
                />
            </div>
        );
    }
}
