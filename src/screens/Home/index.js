import React, { Component, } from 'react';
import { View, Text, TouchableOpacity, BackHandler, AsyncStorage, DeviceEventEmitter } from 'react-native';
import styles from './style';
import { ImagineSwitch } from 'atoms';
import * as icon from 'icons';
import Slider from "react-native-slider";
import * as common from '../../constants/common';
import * as api from '../../constants/api';
import * as keys from '../../constants/keys';
import wifi from 'react-native-android-wifi';

// import firebase from 'react-native-firebase'

export default class Home extends Component {
    listeners = {
        update: DeviceEventEmitter.addListener('refreshDevices', (deviceList) => {
            this.setState({
                deviceList: deviceList
            })
        })
    }
    constructor(props) {
        super(props)
        this.state = {
            switch1On: true,
            switch2On: true,
            switch3On: true,
            switch4On: true,
            fan1On: true,
            fan2On: true,
            sliderValue: 0,
            currentDeviceSerial: '',
            currentSSID: '',
            currentBSSID: '',
            numberOfSwitch: '0',
            numberOfFan: '0',
            deviceList: this.props.navigation.state.params.deviceList
        }
    }
    componentWillMount() {
        this.reScanOnPress()
        BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.goBack()
            return true
        });
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', () => { });
    }

    renderBackButton() {
        return (
            <TouchableOpacity style={{ position: 'absolute', top: 40, left: 20 }} onPress={() => {
                this.props.navigation.goBack()
            }}>
                <Text style={{ fontSize: 15 }}>{`Back`}</Text>
            </TouchableOpacity>
        )
    }
    getVal(val) {
        console.log(val)
    }

    switchControl(actionName, index) {
        if (this.state.currentSSID != '') {
            let deviceId = this.state.currentDeviceSerial
            const axios = require('axios');
            alert(`${api.API_CONTROL_DEVICE}Device_serial=${deviceId}-FN1&Device_action=${actionName} `)
            axios({
                method: 'get',
                url: `${api.API_CONTROL_DEVICE}Device_serial=${deviceId}-FN1&Device_action=${actionName}`,
                headers: {
                    'Content-Type': 'Application/json',
                }
            }).then((response) => {
                if (response.status == 200) {
                    alert(JSON.parse(response.data))
                    // if (response.data. == 'Success') {
                    //     this.props.navigation.navigate('Home')
                    // } else {
                    //     alert(response.data.Error)
                    // }
                }
            })
        }
    }

    //rescaning of wifi network and store all info
    reScanOnPress() {
        wifi.reScanAndLoadWifiList((wifiStringList) => {
            console.log(wifiStringList);
            var wifiArray = JSON.parse(wifiStringList);
            // this.setState({
            //     wifiList: wifiArray,
            // });
            setTimeout(() => {
                let filteredDevices = wifiArray.filter(item =>
                    item.SSID.includes('IMAGINE_')
                )
                if (filteredDevices.length > 0) {
                    this.setState({
                        currentBSSID: filteredDevices[0].BSSID,
                        currentSSID: filteredDevices[0].SSID,
                        currentDeviceSerial: filteredDevices[0].SSID.slice(-8),// finding last 6 character
                        numberOfSwitch: filteredDevices[0].SSID.charAt(9),//finding number of switch
                        numberOfFan: filteredDevices[0].SSID.charAt(12)//finding number of fans
                    })
                } else {
                    // alert('No Imagine device found')
                }
            }, 300);
        },
            (error) => {
                console.log(error);
            }
        );
    }
    render() {
        return (
            <View style={styles.container}>
                {/* {this.renderBackButton()} */}
                <View style={{ flexDirection: 'row', height: 50, marginBottom: 30 }}>
                    <TouchableOpacity style={{
                        width: 100,
                        alignItems: 'center',
                        backgroundColor: common.APP_PRIMARY,
                        marginRight: 15,
                    }} onPress={() => {
                        this.reScanOnPress()
                    }}>
                        <Text style={{ fontSize: 15 }}>{`Home`}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        width: 100,
                        alignItems: 'center',
                        backgroundColor: common.APP_PRIMARY,
                        marginRight: 15,
                    }} onPress={() => {
                        this.props.navigation.navigate('DeviceList')
                    }}>
                        <Text style={{ fontSize: 15 }}>{`Configure Device`}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        width: 100,
                        alignItems: 'center',
                        backgroundColor: common.APP_PRIMARY,
                        marginRight: 15,
                    }} onPress={() => {
                        this.props.navigation.navigate('ControlDevice')
                    }}>
                        <Text style={{ fontSize: 15 }}>{`Control Device`}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        width: 100,
                        alignItems: 'center',
                        backgroundColor: common.APP_PRIMARY,
                        marginRight: 15,
                    }} onPress={() => {
                        AsyncStorage.removeItem(keys.kUSER_DATA)
                        setTimeout(() => {
                            this.props.navigation.navigate('Login')
                        }, 300);
                    }}>
                        <Text style={{ fontSize: 15 }}>{`Logout`}</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', }}>
                    {this.state.deviceList.map((item, index) => {
                        return (<ImagineSwitch
                            title={item.device_Name}
                            style={{ height: 70, width: 70, marginRight: 20, marginBottom: 20 }}
                            source={this.state.switch1On ? icon.IC_CIRCLE_S_OFF : icon.IC_CIRCLE_S_ON}
                            onPress={() => {
                                switch (index) {
                                    case 0:
                                        alert('index')
                                        this.setState({
                                            fan1On: !this.state.fan1On
                                        })
                                        if (!this.state.fan1On) {
                                            this.switchControl(item.device_Name, 2)
                                        } else {
                                            this.switchControl(item.device_Name, 2)
                                        }
                                    case 1:
                                        this.setState({
                                            fan2On: !this.state.fan2On
                                        })
                                        if (!this.state.fan2On) {
                                            this.switchControl(item.device_Name, 2)
                                        } else {
                                            this.switchControl(item.device_Name, 2)
                                        }
                                    case 2:
                                        this.setState({
                                            switch1On: !this.state.switch1On
                                        })
                                        if (!this.state.switch1On) {
                                            this.switchControl(item.device_Name, 2)
                                        } else {
                                            this.switchControl(item.device_Name, 2)
                                        }
                                    case 3:
                                        this.setState({
                                            switch1On: !this.state.switch2On
                                        })
                                        if (!this.state.switch2On) {
                                            this.switchControl(item.device_Name, 2)
                                        } else {
                                            this.switchControl(item.device_Name, 2)
                                        }
                                    case 4:
                                        this.setState({
                                            switch1On: !this.state.switch3On
                                        })
                                        if (!this.state.switch3On) {
                                            this.switchControl(item.device_Name, 2)
                                        } else {
                                            this.switchControl(item.device_Name, 2)
                                        }
                                    case 5:
                                        this.setState({
                                            switch1On: !this.state.switch4On
                                        })
                                        if (!this.state.switch4On) {
                                            this.switchControl(item.device_Name, 2)
                                        } else {
                                            this.switchControl(item.device_Name, 2)
                                        }
                                }
                            }} />)
                    })}

                    {/* <ImagineSwitch
                        style={{ height: 150, width: 150, marginRight: 20, marginBottom: 20 }}
                        source={this.state.switch1On ? icon.IC_CIRCLE_S_OFF : icon.IC_CIRCLE_S_ON}
                        onPress={() => {
                            this.setState({
                                switch1On: !this.state.switch1On
                            })
                            if (!this.state.switch1On) {
                                this.switchControl('TURNOF_SW1', 2)
                            } else {
                                this.switchControl('TURNON_SW1', 2)
                            }
                        }} />
                    <ImagineSwitch
                        style={{ height: 150, width: 150, }}
                        source={this.state.switch2On ? icon.IC_CIRCLE_S_OFF : icon.IC_CIRCLE_S_ON} onPress={() => {
                            this.setState({
                                switch2On: !this.state.switch2On
                            })
                            if (!this.state.switch2On) {
                                this.switchControl('TURNOF_SW2', 2)
                            } else {
                                this.switchControl('TURNON_SW2', 2)
                            }
                        }} />
                    <ImagineSwitch
                        style={{ height: 150, width: 150, marginRight: 20, }}
                        source={this.state.switch3On ? icon.IC_CIRCLE_S_OFF : icon.IC_CIRCLE_S_ON} onPress={() => {
                            this.setState({
                                switch3On: !this.state.switch3On
                            })
                            if (!this.state.switch3On) {
                                this.switchControl('TURNOF_SW3', 3)
                            } else {
                                this.switchControl('TURNON_SW3', 3)
                            }
                        }} />
                    <ImagineSwitch
                        style={{ height: 150, width: 150, }}
                        source={this.state.switch4On ? icon.IC_CIRCLE_S_OFF : icon.IC_CIRCLE_S_ON} onPress={() => {
                            this.setState({
                                switch4On: !this.state.switch4On
                            })
                            if (!this.state.switch4On) {
                                this.switchControl('TURNOF_SW4', 3)
                            } else {
                                this.switchControl('TURNON_SW4', 3)
                            }
                        }} /> */}
                </View>
                <Slider
                    style={{ width: 300, height: 100 }}
                    step={1}
                    minimumValue={0}
                    maximumValue={4}
                    value={this.state.sliderValue}
                    onValueChange={val => {
                        this.setState({ sliderValue: val })
                        if (val == 1) {
                            this.switchControl('FSPEED_FN1_1', 1)
                        } else if (val == 2) {
                            this.switchControl('FSPEED_FN1_2', 1)
                        } else if (val == 3) {
                            this.switchControl('FSPEED_FN1_3', 1)
                        } else if (val == 4) {
                            this.switchControl('FSPEED_FN1_4', 1)
                        } else {
                            this.switchControl('TURNOF_FN1', 1)
                        }

                    }}
                    onSlidingComplete={val => this.getVal(val)}
                />
            </View>
        );
    }
}
