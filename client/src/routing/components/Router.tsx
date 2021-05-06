import * as React from 'react';
import { observer } from 'mobx-react';
import { ILayoutProps } from './Layout';
import { RouterStore } from '../RouterStore';
import PropTypes from 'prop-types';

interface IRouterProps {
    routerState: RouterStore;
    layout: React.ComponentClass<ILayoutProps>;
}

@observer
export class Router extends React.Component<IRouterProps, {}> {
    static childContextTypes: React.ValidationMap<any> = {
        routerState: PropTypes.object.isRequired
    };

    render() {
        const routerState = this.props.routerState;
        const componentProps = routerState.currentStore;

        const layoutProps = {
            mainView: routerState.CurrentView,
            mainViewProps: { store: componentProps },
            mainState: routerState.mainState as any
        };

        return React.createElement(this.props.layout, layoutProps, null);
    }

    getChildContext() {
        return { routerState: this.props.routerState };
    }

    handleNewState = () => this.props.routerState.handleRouteChange();

    componentWillMount() {
        if (!this.props.routerState.wasInitialRouteHandled) {
            this.props.routerState.wasInitialRouteHandled = true;
            this.handleNewState();
        }
        window.addEventListener('popstate', this.handleNewState, false);
    }

    componentWillUnmount() {
        window.removeEventListener('popstate', this.handleNewState);
    }

}
