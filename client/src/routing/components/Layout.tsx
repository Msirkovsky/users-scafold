import * as React from 'react';
import { Grid, Navbar, Nav, NavItem, Button, Glyphicon, } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { IBasicMobxStore } from '../RoutingTypes';
import { MainState } from '../../app/MainState';
import { SpinnerDiv } from '../../common/components/common/Spinner';
import { RouteId } from '../../app/routes';
import { switchToLanguage, Translations } from '../../app/translations';

export interface ILayoutProps {
  mainState: MainState;
  mainView: any;
  mainViewProps: { store: IBasicMobxStore<any> | null };
}

@observer
export class Layout extends React.Component<ILayoutProps, {}> {

  componentDidUpdate(prevProps: any) {
    if (prevProps.mainView !== this.props.mainView) {
      const topBar = document.getElementById('top-bar');
      if (topBar) {
        topBar.scrollIntoView(true);
      } else {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.scrollIntoView(true);
        }
      }
    }
  }

  render() {
    const { mainView, mainViewProps, mainState, mainState: { routingState, userInfo, logout } } = this.props;
    let contentToShow;
    let key;
    if (routingState.isLoading) {
      contentToShow = <SpinnerDiv />;
    } else {
      contentToShow = React.createElement(mainView, mainViewProps, null);
    }
    return (
      <div className="mad-align-start-stretch">
        {
          (!routingState.fullScreen && 
            routingState.route != null)
          &&
          <Navbar collapseOnSelect={false} fluid={true} className="mad-col-1 mad-nav">
            <Navbar.Header className="mad-col-12">
              <Navbar.Brand>
                <span className="logo" />
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav
                activeKey={routingState.route.routeId}
                onSelect={(selectedKey: any) => routingState.navigateToRoute(selectedKey)}
              >
                {

                  <NavItem 
                      className="" 
                      eventKey={RouteId.Dashboard}>
                    <i className="material-icons mad-block">dashboard</i>
                    Menu
                  </NavItem>
                }

               <NavItem 
                    className="" 
                    eventKey={RouteId.UsersList}>
                  <i className="material-icons mad-block">shopping_basket</i>
                  {Translations.usersList}
                  
                </NavItem> 
              </Nav>
              {
                userInfo != null &&
                <Nav pullRight={true} className="mad-margin-top-auto mad-margin-bottom-2x">
                  <NavItem>
                    <span>{userInfo.rolename} - {userInfo.name}</span>
                    <Button onClick={logout}><Glyphicon glyph="off" /></Button>
                  </NavItem>
                </Nav>
              }
            </Navbar.Collapse>
          </Navbar>
        }
        {routingState.fullScreen ? contentToShow : <Grid className="mad-col-11 mad-col-1l mad-padding-3x" fluid={true}>{contentToShow}</Grid>}
      </div>
    );
  }
}
