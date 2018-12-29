import React, { Component } from 'react';
import { View, TouchableOpacity, FlatList, Text, AsyncStorage } from 'react-native';
import styles from './style';
import * as keys from '../../constants/keys';

export default class Menu extends Component {

    constructor(props) {
        super(props)
        this.state = {
            items: ['Home', 'Device List', 'Control Device', 'Logout']
        }
    }
    _renderItem(item) {
        return (
            <TouchableOpacity style={{ height: 50, width: '100%', alignItems: 'flex-start', justifyContent: 'center' }} onPress={() => {
                this.props.navigation.closeDrawer()
                if (item === 'Home') {
                    this.props.navigation.navigate('Home')
                } else if (item === 'Device List') {
                    this.props.navigation.navigate('DeviceList')
                } else if (item === 'Control Device') {
                    this.props.navigation.navigate('ControlDevice')
                } else {
                    AsyncStorage.removeItem(keys.kUSER_DATA)
                    setTimeout(() => {
                        this.props.navigation.navigate('Login')
                    }, 300);
                }
            }}>
                <Text style={{ paddingLeft: 20 }}>{item}</Text>
            </TouchableOpacity>
        )
    }
    render() {
        return (
            <View>
                <FlatList style={{ height: 300, width: '100%' }}
                    data={this.state.items}
                    renderItem={({ item }) => this._renderItem(item)}
                />
            </View>
        );
    }
}
