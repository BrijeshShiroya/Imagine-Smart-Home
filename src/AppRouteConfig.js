import { createStackNavigator, createDrawerNavigator } from 'react-navigation';
import Splash from './screens/Splash';
import Home from './screens/Home';
import Login from './screens/Login';
import Register from './screens/Register';
import ConfigureDevice from './screens/ConfigureDevice';
import AllDevice from './screens/AllDevice';
import DeviceDetail from './screens/DeviceDetail';
import Menu from './screens/Menu';

const AppRouteConfig = createStackNavigator({
    Splash: { screen: Splash, navigationOptions: { gesturesEnabled: false } },
    Login: { screen: Login, navigationOptions: { gesturesEnabled: false } },
    Register: { screen: Register, navigationOptions: { gesturesEnabled: false } },
    DrawerMenu: {
        screen: createDrawerNavigator({
            Home: { screen: Home, },
            ConfigureDevice: { screen: ConfigureDevice },
            AllDevice: { screen: AllDevice },
            DeviceDetail: { screen: DeviceDetail },
            Menu: { screen: Menu },
        }, {
                contentComponent: Menu,
                drawerWidth: 250
            }
        ), navigationOptions: {
            gesturesEnabled: false,
        }
    },
},
    {
        headerMode: 'none'
    })


export default AppRouteConfig;

