import AppRouteConfig from '../../AppRouteConfig';

const initialState = {
    type: 'Reset',
    index: 0,
    routes: [
        { key: 'SplashScreen', routeName: 'DeviceList' },
    ],
};

const navReducer = (state = initialState, action) => {
    const nextState = AppRouteConfig.router.getStateForAction(action, state);
    return nextState || state;
}

export default navReducer;  