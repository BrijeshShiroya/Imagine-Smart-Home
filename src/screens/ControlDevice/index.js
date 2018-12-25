import React, { Component } from 'react';
import { View, BackHandler, AsyncStorage, FlatList, TouchableOpacity, Text } from 'react-native';
import * as keys from '../../constants/keys';
import * as api from '../../constants/api';
import styles from './style';
import { ImagineSwitch } from 'atoms';
import * as icon from 'icons';

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

    _renderItem(item, index) {
        let status = this.getCurrenStatus(item)
        return (
            <TouchableOpacity
                style={{
                    alignItems: 'center',
                    justifyContent: 'flex-start', height: 50,
                    backgroundColor: 'white', flexDirection: 'row'
                }} onPress={() => {
                    this.props.navigation.navigate('ControlDeviceDetail', { selectedItem: item, selectedIndex: index })
                }}>
                <Text style={{ paddingLeft: 20, fontWeight: '800', fontSize: 16 }}>{item.device_Name}</Text>
                <ImagineSwitch
                    title={''}
                    style={{ height: 45, width: 45, position: 'absolute', right: 20 }}
                    source={status ? icon.IC_CIRCLE_S_OFF : icon.IC_CIRCLE_S_ON}
                    onPress={() => {
                        // this.setState({
                        //     switch: true
                        // })
                        setTimeout(() => {
                            // this.controlDevice()
                        }, 200);
                    }} />
                <View style={{ position: 'absolute', height: 1, bottom: 1, width: '100%', backgroundColor: 'black' }} />
            </TouchableOpacity >)
    }

    getCurrenStatus(item) {
        const axios = require('axios');
        axios({
            method: 'get',
            url: `${api.API_CONTROL_DEVICE}Device_serial=${item.device_serials}&Device_action=STATUS_ALL`,
            headers: {
                'Content-Type': 'Application/json',
            }
        }).then((response) => {
            if (response.status === 200) {
                let switchIndex = item.device_serials.slice(-1)
                let responseNew = response.data.Device_Response//'STATUS_1_3_1_1_1_3_0_4'
                let resultDataArray = responseNew.split('_')
                if (item.device_type == 'FAN') {
                    if (switchIndex === '1') {
                        // console.log(resultDataArray[5])
                    } else if (switchIndex === '2') {
                        // console.log(resultDataArray[7])
                    }
                } else {
                    if (resultDataArray[switchIndex] === '1') {
                        return false
                    } else {
                        return true
                    }

                }
            }
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center', height: 50,
                        backgroundColor: 'white', flexDirection: 'row'
                    }} onPress={() => {
                        // this.props.navigation.navigate('ControlDeviceDetail', { selectedItem: item })
                    }}>
                    <Text style={{ paddingLeft: 20, fontWeight: '800', fontSize: 22 }}>All Devices</Text>
                    <View style={{ position: 'absolute', height: 1, bottom: 1, width: '100%', backgroundColor: 'black' }} />
                </TouchableOpacity>
                <FlatList
                    style={{ width: '100%' }}
                    data={this.state.deviceList}
                    renderItem={({ item, index }) => this._renderItem(item, index)}
                />
            </View>
        );
    }
}
