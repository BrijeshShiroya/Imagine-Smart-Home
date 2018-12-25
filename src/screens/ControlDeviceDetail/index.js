import React, { Component } from 'react';
import { View, BackHandler } from 'react-native';
import styles from './style';
import { ImagineSwitch } from 'atoms';
import * as icon from 'icons';
import * as api from '../../constants/api';

export default class ControlDeviceDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentDevice: this.props.navigation.state.params.selectedItem,
            switch: true
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
    //http://imaginesmarthome.com/android_api.php?
    //Apikey=ADMIN@123456789&Action=CONTROL_DEVICE&
    //Device_serial=00D4E4F0-FN1&Device_action=FSPEED_FN1_4

    render() {
        return (
            <View style={styles.container}>
                <ImagineSwitch
                    title={this.state.currentDevice.device_Name}
                    style={{ height: 70, width: 70, marginRight: 20, marginBottom: 20 }}
                    source={this.state.switch ? icon.IC_CIRCLE_S_OFF : icon.IC_CIRCLE_S_ON}
                    onPress={() => {
                        this.setState({
                            switch: !this.state.switch
                        })
                        setTimeout(() => {
                            this.controlDevice()
                        }, 200);
                    }} />

                <ImagineSwitch
                    title={'Refresh'}
                    style={{ height: 70, width: 70, marginRight: 20, marginBottom: 20, marginTop: 100 }}
                    source={icon.IC_CIRCLE_S_OFF}
                    onPress={() => {
                        setTimeout(() => {
                            this.getCurrenStatus()
                        }, 100);
                    }} />
            </View>
        );
    }
}
