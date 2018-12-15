import { createStackNavigator } from 'react-navigation';
import Splash from './screens/Splash';
import Home from './screens/Home';
import Login from './screens/Login';
import Register from './screens/Register';

const AppRouteConfig = createStackNavigator({
    Splash: { screen: Splash, navigationOptions: { gesturesEnabled: false } },
    Home: { screen: Home, navigationOptions: { gesturesEnabled: false } },
    Login: { screen: Login, navigationOptions: { gesturesEnabled: false } },
    Register: { screen: Register, navigationOptions: { gesturesEnabled: false } },

},
    {
        headerMode: 'none'
    })
export default AppRouteConfig;

