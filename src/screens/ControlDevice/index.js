import React, { Component } from 'react';
import { View, BackHandler, AsyncStorage, FlatList, SectionList, TouchableOpacity, Text, DeviceEventEmitter } from 'react-native';
import * as keys from '../../constants/keys';
import * as api from '../../constants/api';
import styles from './style';
import { ImagineSwitch, ImagineNavigationBar, ImagineLoader } from 'atoms';
import * as icon from 'icons';

export default class ControlDevice extends Component {

    constructor(props) {
        super(props)
        this.state = {
            arrMainData: [],
            deviceSerials: {},
            deviceList: [],
            isLoading: false
        }
    }
    componentWillMount() {

        this.getDeviceList(true)
        DeviceEventEmitter.addListener('goToControlDevice', (obj) => {
            this.state.deviceSerials = {}
            this.state.deviceList = []
            this.getDeviceList(false)
        })
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

    getDeviceList(isLoaderAvailable) {
        if (isLoaderAvailable) {
            this.setState({
                isLoading: true
            })
        }
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
                        if (response.data.devices.length > 0) {
                            // alert(JSON.stringify(response.data.devices))
                            var arr = this.state.deviceSerials
                            response.data.devices.map((value) => {
                                let serial = value.device_serials
                                let singleSerial = serial.split('-')[0]
                                let allKeys = Object.keys(arr)
                                //if value available
                                if (allKeys.includes(singleSerial)) {
                                    let arrRes = arr[singleSerial]
                                    value.selected = false
                                    arrRes.push(value)
                                    arr[singleSerial] = arrRes
                                } else {
                                    let arrNew = []
                                    value.selected = false
                                    arrNew.push(value)
                                    arr[singleSerial] = arrNew
                                }
                            })
                            var arrResult = []
                            Object.keys(arr)
                                .forEach(function eachKey(key) {
                                    var obj = {}
                                    obj.title = key
                                    obj.data = arr[key]
                                    arrResult.push(obj)
                                    // console.log(key); // alerts key 
                                    // console.log(arr[key]); // alerts value
                                });
                            setTimeout(() => {
                                this.setState({
                                    deviceList: response.data.devices,
                                    deviceSerials: arr,
                                    arrMainData: arrResult
                                })
                            }, 200);
                            setTimeout(() => {
                                this.getAllStatus(isLoaderAvailable)
                            }, 300);

                        }
                    }
                })
            })
        } catch (error) {
            alert(error)
        }

    }

    _renderItem = ({ item, index, section }) => (

        <TouchableOpacity
            style={{
                alignItems: 'center',
                justifyContent: 'flex-start', height: 50,
                backgroundColor: 'white', flexDirection: 'row'
            }} onPress={() => {
                let obj = {}
                DeviceEventEmitter.emit('goToControlDeviceDetail', obj)
                this.props.navigation.navigate('ControlDeviceDetail', { selectedItem: item, selectedIndex: index })
            }}>
            <Text style={{ paddingLeft: 20, fontWeight: '800', fontSize: 16 }}>{item.device_Name}</Text>
            <ImagineSwitch
                title={''}
                style={{ height: 45, width: 45, position: 'absolute', right: 20 }}
                source={item.selected ? icon.IC_CIRCLE_S_ON : icon.IC_CIRCLE_S_OFF}
                onPress={() => {
                    // this.setState({
                    //     switch: true
                    // })
                    this.controlDevice(!item.selected, item)
                }} />
            <View style={{ position: 'absolute', height: 1, bottom: 1, width: '100%', backgroundColor: 'black' }} />
        </TouchableOpacity >
    )


    controlDevice(switchState, item) {
        this.setState({
            isLoading: true
        })
        const axios = require('axios');
        var deviceAction = ''
        let deviceTitle = item.device_serials.split('-')
        if (switchState) {
            if (item.device_type == 'FAN') {
                // deviceAction = `FSPEED_${deviceTitle[1]}`
                deviceAction = `FSPEED_${deviceTitle[1]}_4`
            } else {
                deviceAction = `TURNON_${deviceTitle[1]}`
            }
        } else {
            if (item.device_type == 'FAN') {
                deviceAction = `FSPEED_${deviceTitle[1]}_4`
            } else {
                deviceAction = `TURNOF_${deviceTitle[1]}`
            }
        }
        //  alert(`${api.API_CONTROL_DEVICE}Device_serial=${item.device_serials}&Device_action=${deviceAction}`)
        //STATUS_1_1_1_1_1_3_0_4
        axios({
            method: 'get',
            url: `${api.API_CONTROL_DEVICE}Device_serial=${item.device_serials}&Device_action=${deviceAction}`,
            headers: {
                'Content-Type': 'Application/json',
            }
        }).then((resultResponse) => {
            if (resultResponse.status == 200) {
                let switchIndex = item.device_serials.slice(-1)
                let response = resultResponse.data.Device_Response//'STATUS_1_3_1_1_1_3_0_4'
                let resultDataArray = response.split('_')
                if (item.device_type == 'FAN') {
                    if (switchIndex === '1') {
                        alert(resultDataArray[5])
                    } else if (switchIndex === '2') {
                        alert(resultDataArray[7])
                    }
                } else {
                    if (resultDataArray[switchIndex] === '1') {
                        // this.setState({
                        //     switch: false
                        // })
                        item.selected = false
                    } else {
                        // this.setState({
                        //     switch: true
                        // })
                        item.selected = true
                    }
                }
                setTimeout(() => {
                    this.setState({
                        isLoading: false
                    })
                }, 100);
            }
        })
    }

    getAllStatus(loaderAvailable) {
        if (loaderAvailable) {
            this.setState({
                isLoading: true
            })
        }
        let allKeys = Object.keys(this.state.deviceSerials)
        allKeys.map((serial) => {
            this.getCurrenStatus(serial, this.state.deviceSerials[serial])
        })

    }

    getCurrenStatus(serial, allSerialItems) {
        const axios = require('axios');
        axios({
            method: 'get',
            url: `${api.API_CONTROL_DEVICE}Device_serial=${serial}&Device_action=STATUS_ALL`,
            headers: {
                'Content-Type': 'Application/json',
            }
        }).then((response) => {
            if (response.status === 200) {
                let responseNew = response.data.Device_Response//'STATUS_1_3_1_1_1_3_0_4
                let resultDataArray = responseNew.split('_')
                allSerialItems.map((item) => {
                    let switchIndex = item.device_serials.slice(-1)
                    if (item.device_type == 'FAN') {
                        if (switchIndex === '1') {
                            // console.log(resultDataArray[5])
                        } else if (switchIndex === '2') {
                            // console.log(resultDataArray[7])
                        }
                    } else {
                        if (resultDataArray[switchIndex] === '1') {
                            item.selected = true
                        } else {
                            item.selected = false
                        }
                    }
                })
                setTimeout(() => {
                    // alert(JSON.stringify(this.state.deviceSerials))
                    this.setState({
                        isLoading: false
                    })
                }, 500);
            }
        })
    }

    render() {
        let allKeys = Object.keys(this.state.deviceSerials)
        return (
            <View style={styles.container}>
                <ImagineNavigationBar
                    title={'All Devices'}
                    isMenu={true}
                    onLeftPress={() => {
                        this.props.navigation.openDrawer()
                    }}
                />
                <SectionList
                    style={{ flex: 1, width: '100%' }}
                    sections={this.state.arrMainData}
                    renderItem={this._renderItem}
                    renderSectionHeader={({ section }) => <Text style={{ height: 0, width: '100%', backgroundColor: 'red' }}>{section.title}</Text>}
                />
                {/* <FlatList
                    style={{ width: '100%' }}
                    extraData={this.state}
                    data={this.state.deviceSerials[allKeys[0]]}
                    renderItem={({ item, index }) => this._renderItem(item, index)}
                /> */}
                <ImagineLoader isVisible={this.state.isLoading} />
            </View>
        );
    }
}
