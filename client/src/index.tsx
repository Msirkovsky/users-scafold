import 'core-js/es6/symbol';
import 'core-js/es6/object';
import 'core-js/es6/function';
import 'core-js/es6/parse-int';
import 'core-js/es6/parse-float';
import 'core-js/es6/number';
import 'core-js/es6/math';
import 'core-js/es6/string';
import 'core-js/es6/date';
import 'core-js/es6/array';
import 'core-js/es6/regexp';
import 'core-js/es6/map';
import 'core-js/es6/set';
import 'core-js/es6/reflect';
import * as moment from 'moment';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './App';
import routingDefinition from './app/routingDefinition';
import { MainState } from './app/MainState';
import { useStrict } from 'mobx';

import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/fonts/fontawesome-webfont.woff2';
import 'font-awesome/css/font-awesome.css';
import 'react-widgets/dist/css/react-widgets.css';
import './styles/data-table.css';
import './styles/style.css';
import './styles/style-override.css';
import './styles/madStyles/styles.css';
// import './styles/madStyles/materialIconst.css';

import 'moment/locale/en-gb';
import 'moment/locale/cs';
import simpleNumberLocalizer from 'react-widgets-simple-number';
import momentLocalizer from 'react-widgets-moment';

useStrict(true);
simpleNumberLocalizer();
moment.locale('cs');
momentLocalizer();

// const hmrActive = localStorage.getItem('hmr_active');

// if (process.env.NODE_ENV === 'development') {
//     document.addEventListener('keydown', (event) => {
//         if (event.ctrlKey && event.key === 'h') {
//             localStorage.setItem('hmr_active', hmrActive === 'true' ? 'false' : 'true');
//             window.location.reload(true);
//             if (event.cancelable) {
//                 event.preventDefault();
//             }
//         }

//     });
// }

const mainState = new MainState(routingDefinition);
const rootEl = document.getElementById('root') as HTMLElement;

ReactDOM.render(
    <App mainState={mainState}/>
    ,
    rootEl
);

// if (hmrActive === 'true' && module.hot) {
//     module.hot.accept('./App', () => {
//         AppComponent = require('./App').default;
//         ReactDOM.render(
//             <AppComponent mainState={mainState}/>,
//             rootEl
//         );
//     });
//     module.hot.accept('./app/routingDefinition', () => {
//         const newRoutingDefinition = require('./app/routingDefinition').default;
//         mainState.routingState.replaceRoutes(newRoutingDefinition);
//         ReactDOM.render(
//             <AppComponent mainState={mainState} />,
//             rootEl
//         );
//     });

// }
