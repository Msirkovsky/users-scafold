import * as React from 'react';
import { RouteId } from '../../app/routes';
import PropTypes from 'prop-types';

interface ILinkProps extends React.HTMLProps<HTMLAnchorElement> {
    routeId: RouteId;
    params?: any;
    children?: any;
}

export class Link extends React.Component<ILinkProps, {}> {

    static contextTypes: React.ValidationMap<any> = {
        routerState: PropTypes.object.isRequired
    };

    onClick = (event: any) => {
        event.preventDefault();
        this.context.routerState.navigateToRoute(this.props.routeId, this.props.params);
    }

    render() {
        let { routeId, params, children, ...rest } = this.props;
        return <a {...rest} onClick={this.onClick}>{children}</a>;
    }
}