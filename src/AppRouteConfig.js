import { createStackNavigator, createDrawerNavigator } from 'react-navigation';
import Splash from './screens/Splash';
import Home from './screens/Home';
import Login from './screens/Login';
import Register from './screens/Register';
import DeviceList from './screens/DeviceList';
import ControlDevice from './screens/ControlDevice';
import ControlDeviceDetail from './screens/ControlDeviceDetail';
import Menu from './screens/Menu';

const AppRouteConfig = createStackNavigator({
    Splash: { screen: Splash, navigationOptions: { gesturesEnabled: false } },
    Login: { screen: Login, navigationOptions: { gesturesEnabled: false } },
    Register: { screen: Register, navigationOptions: { gesturesEnabled: false } },
    DrawerMenu: {
        screen: createDrawerNavigator({
            Home: { screen: Home, },
            DeviceList: { screen: DeviceList },
            ControlDevice: { screen: ControlDevice },
            ControlDeviceDetail: { screen: ControlDeviceDetail },
            Menu: { screen: Menu },
        }, {
                contentComponent: Menu,
                drawerWidth: 250
            }
        )
    },
},
    {
        headerMode: 'none'
    })
export default AppRouteConfig;

