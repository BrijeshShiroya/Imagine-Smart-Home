import React from 'react';
import { View } from 'react-native';
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './store';
import AppRouteConfig from './AppRouteConfig';
import {
    reduxifyNavigator,
    createReactNavigationReduxMiddleware,
    createNavigationReducer,
} from 'react-navigation-redux-helpers';


// Note: createReactNavigationReduxMiddleware must be run before reduxifyNavigator
const middleware = createReactNavigationReduxMiddleware(
    "root",
    state => state.nav,
);

//make reduxify navigator - v2.0 and pass to mapStateToProps
const App = reduxifyNavigator(AppRouteConfig, "root");

const mapStateToProps = (state) => ({
    state: state.nav,
});

const AppWithNavigationState = connect(mapStateToProps)(App);

//create store
const store = createStore(
    rootReducer,
    compose(applyMiddleware(thunk)),
);

export default class Root extends React.Component {

    componentDidMount() {
        console.disableYellowBox = true;
    }
    render() {
        return (
            <Provider store={store}>
                <AppWithNavigationState />
            </Provider>
        );
    }
}