import React, { Component } from 'react';
import { View, BackHandler, AsyncStorage, FlatList, TouchableOpacity, Text } from 'react-native';
import * as keys from '../../constants/keys';
import * as api from '../../constants/api';
import styles from './style';
export default class ControlDevice extends Component {

    constructor(props) {
        super(props)
        this.state = {
            deviceList: []
        }
    }
    componentWillMount() {

        this.getDeviceList()
        BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.goBack()
            return true
        });
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', () => { });
    }

    componentWillReceiveProps(newProps) {
        if (newProps) {

        }
    }

    getDeviceList() {

    }

    getDeviceList() {
        try {
            AsyncStorage.getItem(keys.kUSER_DATA).then((user) => {
                let userData = JSON.parse(user)
                const axios = require('axios');
                axios({
                    method: 'get',
                    url: `${api.API_GET_DEVICES}REG_USER=${userData.mobile}`,
                    headers: {
                        'Content-Type': 'Application/json',
                    }
                }).then((response) => {
                    if (response.status == 200) {
                        // alert(response.data["devices"])
                        if (response.data.devices.length > 0) {
                            this.setState({
                                deviceList: response.data.devices
                            })
                        }
                    }
                })
            })
        } catch (error) {
            alert(error)
        }

    }

    _renderItem(item) {
        return (
            <TouchableOpacity style={{ height: 40, width: '100%' }} onPress={() => {
                this.props.navigation.navigate('ControlDeviceDetail', { selectedItem: item })
            }}>
                <Text>{item.device_Name}</Text>
            </TouchableOpacity>)
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList style={{ height: 300, width: '100%' }}
                    data={this.state.deviceList}
                    renderItem={({ item }) => this._renderItem(item)}
                    contentContainerStyle={{ marginLeft: 20 }} />
            </View>
        );
    }
}
