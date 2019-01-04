import React, { Component } from 'react';
import { View, TouchableOpacity, FlatList, Text, AsyncStorage, Image, Alert } from 'react-native';
import styles from './style';
import * as keys from '../../constants/keys';
import * as common from '../../constants/common';
import * as icon from 'icons';

export default class Menu extends Component {

    constructor(props) {
        super(props)
        this.state = {
            items: ['Home', 'Configure Device', 'All Devices', 'Logout'],
            user: {
                mobile: ''
            }
        }
        try {
            AsyncStorage.getItem(keys.kUSER_DATA).then((userData) => {
                let user = JSON.parse(userData)
                this.setState({
                    user
                })
            })
        } catch (error) {
            alert(error)
        }

    }
    getImage(item) {
        if (item === 'Home') {
            return <Image source={icon.IC_HOME} />
        } else if (item === 'Configure Device') {
            return <Image source={icon.IC_DEVICE_LIST} />
        } else if (item === 'All Devices') {
            return <Image source={icon.IC_CONFIG_DEVICE} />
        } else {
            return <Image source={icon.IC_LOGOUT} />
        }
    }
    _renderItem(item) {
        return (
            <TouchableOpacity style={{ paddingLeft: 10, height: 50, width: '100%', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row' }} onPress={() => {
                this.props.navigation.closeDrawer()
                if (item === 'Home') {
                    this.props.navigation.navigate('Home')
                } else if (item === 'Configure Device') {
                    this.props.navigation.navigate('DeviceList')
                } else if (item === 'All Devices') {
                    this.props.navigation.navigate('ControlDevice')
                } else {

                    Alert.alert('Are you sure you want to logout?', '',
                        [{
                            text: 'Logout', onPress: () => {
                                AsyncStorage.removeItem(keys.kUSER_DATA)
                                setTimeout(() => {
                                    this.props.navigation.navigate('Login')
                                }, 300);
                            }
                        },
                        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },])

                }
            }}>
                {
                    this.getImage(item)
                }
                < Text style={{ paddingLeft: 10 }}> {item}</Text >
                <View style={{ position: 'absolute', height: 1, left: 0, bottom: 0, right: 0, backgroundColor: 'black', width: '120%' }} />
            </TouchableOpacity >
        )
    }
    render() {
        return (
            <View>
                <View style={{ height: 100, width: '100%', backgroundColor: common.APP_PRIMARY, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 20, color: 'white', fontWeight: '600' }}>{this.state.user.mobile}</Text>
                </View>
                <FlatList style={{ height: 300, width: '100%' }}
                    data={this.state.items}
                    renderItem={({ item }) => this._renderItem(item)}
                />
            </View>
        );
    }
}
