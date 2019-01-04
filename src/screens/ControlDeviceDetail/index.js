import React, { Component } from 'react';
import {
    View,
    BackHandler,
    Text,
    AsyncStorage,
    Modal,
    TouchableHighlight,
    DeviceEventEmitter,
    ActivityIndicator,
    Alert
} from 'react-native';
import styles from './style';
import { ImagineSwitch, ImagineTextfield, ImagineNavigationBar, ImagineButton } from 'atoms';
import * as icon from 'icons';
import * as api from '../../constants/api';
import * as common from '../../constants/common';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import * as keys from '../../constants/keys';

export default class ControlDeviceDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            currentDevice: this.props.navigation.state.params.selectedItem,
            switch: false,
            deviceName: this.props.navigation.state.params.selectedItem.device_Name,
            modalVisible: false,
        }

    }
    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    componentWillFocus() {
    }


    componentWillMount() {
        this.getCurrenStatus()
        DeviceEventEmitter.addListener('goToControlDeviceDetail', (obj) => {
            this.getCurrenStatus()
        })
        BackHandler.addEventListener('hardwareBackPress', () => {
            DeviceEventEmitter.emit('goToControlDevice', {})
            this.props.navigation.navigate('ControlDevice')
            return true
        });
    }

    componentWillUnmount() {
        DeviceEventEmitter.removeListener('goToControlDeviceDetail')
        BackHandler.removeEventListener('hardwareBackPress', () => { });
    }

    componentWillReceiveProps(newProps) {
        if (newProps) {

        }
    }
    getCurrenStatus() {
        this.setState({
            isLoading: true
        })
        const axios = require('axios');
        axios({
            method: 'get',
            url: `${api.API_CONTROL_DEVICE}Device_serial=${this.props.navigation.state.params.selectedItem.device_serials}&Device_action=STATUS_ALL`,
            headers: {
                'Content-Type': 'Application/json',
            }
        }).then((response) => {
            this.setState({
                isLoading: false
            })
            if (response.status === 200) {
                let switchIndex = this.props.navigation.state.params.selectedItem.device_serials.slice(-1)
                let responseNew = response.data.Device_Response//'STATUS_1_3_1_1_1_3_0_4'
                let resultDataArray = responseNew.split('_')
                if (this.props.navigation.state.params.selectedItem.device_type == 'FAN') {
                    if (switchIndex === '1') {
                        // console.log(resultDataArray[5])
                    } else if (switchIndex === '2') {
                        // console.log(resultDataArray[7])
                    }
                } else {
                    if (resultDataArray[switchIndex] == 1) {
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

    controlDevice(switchState) {
        this.setState({
            isLoading: true
        })
        const axios = require('axios');
        var deviceAction = ''
        let deviceTitle = this.props.navigation.state.params.selectedItem.device_serials.split('-')
        if (switchState) {
            if (this.props.navigation.state.params.selectedItem.device_type == 'FAN') {
                // deviceAction = `FSPEED_${deviceTitle[1]}`
                deviceAction = `FSPEED_${deviceTitle[1]}_4`
            } else {
                deviceAction = `TURNON_${deviceTitle[1]}`
            }
        } else {
            if (this.props.navigation.state.params.selectedItem.device_type == 'FAN') {
                deviceAction = `FSPEED_${deviceTitle[1]}_4`
            } else {
                deviceAction = `TURNOF_${deviceTitle[1]}`
            }
        }
        // alert(`${api.API_CONTROL_DEVICE}Device_serial=${this.props.navigation.state.params.selectedItem.device_serials}&Device_action=${deviceAction}`)
        //STATUS_1_1_1_1_1_3_0_4
        axios({
            method: 'get',
            url: `${api.API_CONTROL_DEVICE}Device_serial=${this.props.navigation.state.params.selectedItem.device_serials}&Device_action=${deviceAction}`,
            headers: {
                'Content-Type': 'Application/json',
            }
        }).then((resultResponse) => {
            this.setState({
                isLoading: false
            })
            if (resultResponse.status == 200) {
                this.getCurrenStatus()
                return;
                let switchIndex = this.props.navigation.state.params.selectedItem.device_serials.slice(-1)
                let response = resultResponse.data.Device_Response//'STATUS_1_3_1_1_1_3_0_4'
                alert(response)
                let resultDataArray = response.split('_')
                if (this.props.navigation.state.params.selectedItem.device_type == 'FAN') {
                    if (switchIndex === '1') {
                        alert(resultDataArray[5])
                    } else if (switchIndex === '2') {
                        alert(resultDataArray[7])
                    }
                } else {
                    // alert(resultDataArray[switchIndex])
                    if (resultDataArray[switchIndex] == 1) {
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
        Alert.alert('Are you sure you want to delete this device?', '',
            [{
                text: 'Delete', onPress: () => {
                    try {
                        AsyncStorage.getItem(keys.kUSER_DATA).then((user) => {
                            let userData = JSON.parse(user)
                            const axios = require('axios');
                            axios({
                                method: 'get',
                                url: `${api.API_DELETE_DEVICE}REG_USER=${userData.mobile}&Device_serial=${this.props.navigation.state.params.selectedItem.device_serials}`,
                                headers: {
                                    'Content-Type': 'Application/json',
                                }
                            }).then((response) => {
                                if (response.status == 200) {
                                    DeviceEventEmitter.emit('goToControlDevice', {})
                                    this.props.navigation.navigate('ControlDevice')
                                }
                            })
                        })
                    } catch (error) {
                        alert(error)
                    }
                }
            },
            { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },])


    }

    //http://imaginesmarthome.com/android_api.php?Apikey=ADMIN@123456789&
    //Action=UPDATE_DEVICE&REG_USER=7600016941&Device_name=night%20lamp&Device_serial=00D4E4F0-FN1
    editDeviceName(deviceNewName) {
        try {
            AsyncStorage.getItem(keys.kUSER_DATA).then((user) => {
                let userData = JSON.parse(user)
                const axios = require('axios');
                alert(`${api.API_UPDATE_DEVICE}REG_USER=${userData.mobile}&Device_name=${deviceNewName}&Device_serial=${this.props.navigation.state.params.selectedItem.device_serials}`)
                axios({
                    method: 'get',
                    url: `${api.API_UPDATE_DEVICE}REG_USER=${userData.mobile}&Device_name=${deviceNewName}&Device_serial=${this.props.navigation.state.params.selectedItem.device_serials}`,
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
                                        // alert(responseNew.data["devices"])
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

    renderTextFieldView() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                    this.setModalVisible(false)
                }}>
                <View style={{ height: '100%', width: '100%', backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ height: 200, width: 300, backgroundColor: common.APP_PRIMARY, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                        <ImagineTextfield
                            style={{ marginBottom: 15, color: 'black', backgroundColor: 'white', width: 200 }}
                            placeholder={'Enter device name'}
                            value={this.state.deviceName}
                            maxLength={40}
                            onChangeText={(value) => { this.setState({ deviceName: value }) }}
                        />

                        <TouchableHighlight
                            style={{ height: 40, width: 100, backgroundColor: 'white', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}
                            onPress={() => {
                                this.setModalVisible(!this.state.modalVisible);
                                setTimeout(() => {
                                    if (this.state.deviceName != '') {
                                        this.editDeviceName(this.state.deviceName)
                                    }
                                }, 300);
                            }}>
                            <Text style={{ color: common.APP_PRIMARY }}>Save</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={{ height: 40, marginTop: 10, width: 100, backgroundColor: 'white', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}
                            onPress={() => {
                                this.setModalVisible(!this.state.modalVisible);

                            }}>
                            <Text style={{ color: common.APP_PRIMARY }}>Cancel</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        )
    }
    render() {
        return (
            <GestureRecognizer
                style={styles.container}
                onSwipeDown={(state) => {
                    this.getCurrenStatus()
                }
                }>
                <ImagineNavigationBar
                    title={this.props.navigation.state.params.selectedItem.device_Name}
                    isMenu={false}
                    onLeftPress={() => {
                        DeviceEventEmitter.emit('goToControlDevice', {})
                        this.props.navigation.navigate('ControlDevice')
                    }}
                />
                <View style={{ flexDirection: 'row', position: 'absolute', top: 0, right: 0, height: 50, width: 90, justifyContent: 'center' }}>
                    <ImagineSwitch
                        title={''}
                        style={{ height: 24, width: 24, alignSelf: 'center', position: 'absolute', right: 20 }}
                        source={icon.IC_EDIT}
                        onPress={() => {
                            this.setState({
                                deviceName: this.props.navigation.state.params.selectedItem.device_Name
                            })
                            this.setModalVisible(true);

                        }} />
                    <ImagineSwitch
                        title={''}
                        style={{ height: 24, width: 24, alignSelf: 'center', position: 'absolute', right: 60 }}
                        source={icon.IC_DELETE}
                        onPress={() => {
                            this.deleteDevice()
                        }} />
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <ImagineSwitch
                        title={''}
                        style={{ height: 200, width: 200, marginRight: 20, marginBottom: 20 }}
                        source={this.state.switch ? icon.IC_CIRCLE_S_ON : icon.IC_CIRCLE_S_OFF}
                        onPress={() => {
                            this.controlDevice(!this.state.switch)
                        }} />
                    <Text style={{ color: 'black', fontSize: 20 }}>
                        {this.state.switch ?
                            `${this.props.navigation.state.params.selectedItem.device_Name} IS ON` : `${this.props.navigation.state.params.selectedItem.device_Name} IS OFF`}
                    </Text>
                    <View style={{ height: 60, width: '100%' }}>
                        {this.state.isLoading ? <ActivityIndicator size="large" color={common.APP_PRIMARY} /> : null}
                    </View>
                </View>


                {this.renderTextFieldView()}
            </GestureRecognizer >
        );
    }
}
