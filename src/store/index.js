import { combineReducers } from 'redux';
import navReducer from './Navigation/reducers';

const rootReducer = combineReducers({
    nav: navReducer,
});

export default rootReducer;