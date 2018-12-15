import { createStackNavigator } from 'react-navigation';
import Splash from './screens/Splash';
import Home from './screens/Home';

const AppRouteConfig = createStackNavigator({
    Splash: { screen: Splash, navigationOptions: { gesturesEnabled: false } },
    Home: { screen: Home, navigationOptions: { gesturesEnabled: false } },
},
    {
        headerMode: 'none'
    })
export default AppRouteConfig;

