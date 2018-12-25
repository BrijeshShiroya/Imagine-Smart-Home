import React, { Component } from 'react';
import { View, BackHandler, Text, AsyncStorage } from 'react-native';
import styles from './style';
import { ImagineSwitch, ImagineTextfield } from 'atoms';
import * as icon from 'icons';
import * as api from '../../constants/api';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import * as keys from '../../constants/keys';

export default class ControlDeviceDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentDevice: this.props.navigation.state.params.selectedItem,
            switch: true,
            deviceName: '',
        }
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.goBack()
            return true
        });
    }

    componentDidMount() {
        setTimeout(() => {
            this.getCurrenStatus()
        }, 100);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', () => { });
    }

    componentWillReceiveProps(newProps) {
        if (newProps) {

        }
    }
    getCurrenStatus() {
        const axios = require('axios');
        axios({
            method: 'get',
            url: `${api.API_CONTROL_DEVICE}Device_serial=${this.state.currentDevice.device_serials}&Device_action=STATUS_ALL`,
            headers: {
                'Content-Type': 'Application/json',
            }
        }).then((response) => {
            if (response.status === 200) {
                let switchIndex = this.state.currentDevice.device_serials.slice(-1)
                let responseNew = response.data.Device_Response//'STATUS_1_3_1_1_1_3_0_4'
                let resultDataArray = responseNew.split('_')
                if (this.state.currentDevice.device_type == 'FAN') {
                    if (switchIndex === '1') {
                        // console.log(resultDataArray[5])
                    } else if (switchIndex === '2') {
                        // console.log(resultDataArray[7])
                    }
                } else {
                    if (resultDataArray[switchIndex] === '1') {
                        this.setState({
                            switch: false
                        })
                    } else {
                        this.setState({
                            switch: true
                        })
                    }

                }
            }
        })
    }

    controlDevice() {
        const axios = require('axios');
        var deviceAction = ''
        let deviceTitle = this.state.currentDevice.device_serials.split('-')
        if (!this.state.switch) {
            if (this.state.currentDevice.device_type == 'FAN') {
                // deviceAction = `FSPEED_${deviceTitle[1]}`
                deviceAction = `FSPEED_${deviceTitle[1]}_4`
            } else {
                deviceAction = `TURNON_${deviceTitle[1]}`
            }
        } else {
            if (this.state.currentDevice.device_type == 'FAN') {
                deviceAction = `FSPEED_${deviceTitle[1]}_4`
            } else {
                deviceAction = `TURNOF_${deviceTitle[1]}`
            }
        }
        //STATUS_1_1_1_1_1_3_0_4
        axios({
            method: 'get',
            url: `${api.API_CONTROL_DEVICE}Device_serial=${this.state.currentDevice.device_serials}&Device_action=${deviceAction}`,
            headers: {
                'Content-Type': 'Application/json',
            }
        }).then((response) => {
            if (response.status == 200) {
                let switchIndex = this.state.currentDevice.device_serials.slice(-1)
                let response = response.data.Device_Response//'STATUS_1_3_1_1_1_3_0_4'
                let resultDataArray = response.split('_')
                alert(JSON.stringify(response))
                if (this.state.currentDevice.device_type == 'FAN') {
                    if (switchIndex === '1') {
                        alert(resultDataArray[5])
                    } else if (switchIndex === '2') {
                        alert(resultDataArray[7])
                    }
                } else {
                    if (resultDataArray[switchIndex] === '1') {
                        this.setState({
                            switch: true
                        })
                    } else {
                        this.setState({
                            switch: false
                        })
                    }

                }
            }
        })
    }

    //http://imaginesmarthome.com/android_api.php?Apikey=ADMIN@123456789&Action=
    //DELETE_DEVICE&REG_USER=7600016941&Device_serial=00D4E4F0-FN1
    deleteDevice() {
        try {
            AsyncStorage.getItem(keys.kUSER_DATA).then((user) => {
                let userData = JSON.parse(user)
                const axios = require('axios');
                axios({
                    method: 'get',
                    url: `${api.API_DELETE_DEVICE}REG_USER=${userData.mobile}&Device_serial=${this.state.currentDevice.device_serials}`,
                    headers: {
                        'Content-Type': 'Application/json',
                    }
                }).then((response) => {
                    if (response.status == 200) {
                        alert(JSON.stringify(response.data))
                    }
                })
            })
        } catch (error) {
            alert(error)
        }

    }

    //http://imaginesmarthome.com/android_api.php?Apikey=ADMIN@123456789&
    //Action=UPDATE_DEVICE&REG_USER=7600016941&Device_name=night%20lamp&Device_serial=00D4E4F0-FN1
    editDeviceName(deviceNewName) {
        try {
            AsyncStorage.getItem(keys.kUSER_DATA).then((user) => {
                let userData = JSON.parse(user)
                const axios = require('axios');
                axios({
                    method: 'get',
                    url: `${api.API_UPDATE_DEVICE}REG_USER=${userData.mobile}&Device_name=${deviceNewName}&Device_serial=${this.state.currentDevice.device_serials}`,
                    headers: {
                        'Content-Type': 'Application/json',
                    }
                }).then((response) => {
                    if (response.status == 200) {
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
                                }).then((responseNew) => {
                                    if (responseNew.status == 200) {
                                        // alert(response.data["devices"])
                                        if (responseNew.data.devices.length > 0) {
                                            let index = this.props.navigation.state.params.selectedIndex
                                            this.setState({
                                                currentDevice: responseNew.data.devices[index]
                                            })
                                        }
                                    }
                                })
                            })
                        } catch (error) {
                            alert(error)
                        }

                    }
                })
            })
        } catch (error) {
            alert(error)
        }

    }
    render() {
        return (
            <GestureRecognizer
                style={styles.container}
                onSwipeDown={(state) => {
                    this.getCurrenStatus()
                }
                }>
                <View style={{ flexDirection: 'row', backgroundColor: 'red', height: 60, width: '100%', justifyContent: 'center' }}>
                    <ImagineSwitch
                        title={''}
                        style={{ height: 30, width: 30, alignSelf: 'center', position: 'absolute', right: 20 }}
                        source={icon.IC_EDIT}
                        onPress={() => {
                            if (this.state.deviceName != '') {
                                this.editDeviceName(this.state.deviceName)
                            }
                        }} />
                    <ImagineSwitch
                        title={''}
                        style={{ height: 30, width: 30, alignSelf: 'center', position: 'absolute', right: 80 }}
                        source={icon.IC_DELETE}
                        onPress={() => {
                            this.deleteDevice()
                        }} />
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <ImagineSwitch
                        title={this.state.currentDevice.device_Name}
                        style={{ height: 200, width: 200, marginRight: 20, marginBottom: 20 }}
                        source={this.state.switch ? icon.IC_CIRCLE_S_OFF : icon.IC_CIRCLE_S_ON}
                        onPress={() => {
                            this.setState({
                                switch: !this.state.switch
                            })
                            setTimeout(() => {
                                this.controlDevice()
                            }, 200);
                        }} />
                    <Text style={{ color: 'white' }}>
                        {this.state.switch ?
                            `${this.state.currentDevice.device_Name} IS OFF` : `${this.state.currentDevice.device_Name} IS ON`}
                    </Text>
                </View>
                <ImagineTextfield
                    style={{ marginBottom: 15, color: 'white' }}
                    placeholder={'Enter device name'}
                    value={this.state.deviceName}
                    maxLength={40}
                    onChangeText={(value) => { this.setState({ deviceName: value }) }}
                />
            </GestureRecognizer >
        );
    }
}
