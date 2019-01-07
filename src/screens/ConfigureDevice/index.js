import React, { Component } from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    ScrollView,
    View,
    FlatList,
    PermissionsAndroid,
    Linking,
    BackHandler,
    WebView,
    AsyncStorage,
    DeviceEventEmitter
} from 'react-native';
import { ImagineTextfield, ImagineButton, ImagineNavigationBar } from 'atoms';
import * as api from '../../constants/api';
import * as keys from '../../constants/keys';
import wifi from 'react-native-android-wifi';
import styles from './style';

export default class ConfigureDevice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            deviceConfUrl: '',
            txtSSID: '',
            txtPassword: '',
            numberOfSwitch: '0',
            numberOfFan: '0',
            currentDeviceSerial: '',
            currentSSID: '',
            currentPassword: '',
            currentBSSID: '',
            isWifiNetworkEnabled: null,
            wifiList: [],
            modalVisible: false,
            currentScannedWifi: '',
            arrMainData: [],
            deviceSerials: {},
            deviceList: [],
        };

    }

    componentDidMount() {
        this.askForUserPermissions();
    }

    componentWillMount() {
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

    async askForUserPermissions() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    'title': 'Wifi networks',
                    'message': 'We need your permission in order to find wifi networks'
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("Thank you for your permission! :)");
            } else {
                console.log("You will not able to retrieve wifi available networks list");
            }
        } catch (err) {
            console.warn(err)
        }
    }
    // getWifiNetworksOnPress() {
    //     wifi.loadWifiList((wifiStringList) => {
    //         console.log(wifiStringList);
    //         var wifiArray = JSON.parse(wifiStringList);
    //         this.setState({
    //             wifiList: wifiArray,
    //             modalVisible: true
    //         });
    //         setTimeout(() => {
    //             let filteredDevices = this.state.wifiList.filter(item =>
    //                 item.SSID.includes('IMAGINE')
    //             )
    //             alert(JSON.stringify(filteredDevices[0]))
    //         }, 300);
    //     },
    //         (error) => {
    //             console.log(error);
    //         }
    //     );
    // }

    findAndConnect() {
        wifi.findAndConnect(this.state.currentSSID, this.state.currentPassword, (found) => {
            alert(found)
        });
    }

    reScanWifi() {
        wifi.reScanAndLoadWifiList((wifiStringList) => {
            console.log(wifiStringList);
            var wifiArray = JSON.parse(wifiStringList);
            this.setState({
                wifiList: wifiArray,
            });
        },
            (error) => {
                console.log(error);
            }
        );
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
                    this.findAndConnect()
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

    //connectiong device to router
    connectDeviceToRouter() {
        this.setState({
            deviceConfUrl: `http://192.168.4.1/wifisave?s=${this.state.currentScannedWifi}&p=${this.state.txtPassword}`
        })
        // Linking.openURL(`http://192.168.4.1/wifisave?s=${this.state.currentScannedWifi}&p=${this.state.txtPassword}`).catch(err => console.error('An error occurred', err));
        // alert(`http://192.168.4.1/wifisave?s=${this.state.currentScannedWifi}&p=${this.state.txtPassword}`)
        //http://192.168.4.1/wifisave?s=wifiname &p=wifipass
        // if (this.state.txtSSID != '' && this.state.txtPassword != '') {
        //     const axios = require('axios');
        //     axios({
        //         method: 'get',
        //         url: `http://192.168.4.1/wifisave?s=${this.state.currentScannedWifi}&p=${this.state.txtPassword}`,
        //         headers: {
        //             'Content-Type': 'Application/json',
        //         }
        //     }).then((response) => {
        //         if (response.status == 200) {
        //             console.log(JSON.parse(response.data))
        //             if (response.data.Error == 'Success') {
        //                 // alert(JSON.stringify(response.data))
        //                 alert('scucess')
        //             } else {
        //                 alert(response.data.Error)
        //             }
        //         }
        //     })
        // }
    }



    renderModal() {
        var wifiListComponents = [];
        for (w in this.state.wifiList) {
            wifiListComponents.push(
                <View key={w} style={styles.instructionsContainer}>
                    <Text style={styles.instructionsTitle}>{this.state.wifiList[w].SSID}</Text>
                    <Text>BSSID: {this.state.wifiList[w].BSSID}</Text>
                    <Text>Capabilities: {this.state.wifiList[w].capabilities}</Text>
                    <Text>Frequency: {this.state.wifiList[w].frequency}</Text>
                    <Text>Level: {this.state.wifiList[w].level}</Text>
                    <Text>Timestamp: {this.state.wifiList[w].timestamp}</Text>
                </View>
            );
        }
        return wifiListComponents;
    }
    renderTextFieldView() {
        return (
            <View style={{ width: '100%', marginTop: 20 }}>
                <ImagineTextfield
                    style={{ marginBottom: 15 }}
                    placeholder={'SSID'}
                    value={this.state.currentScannedWifi}
                    keyboardType='number-pad'
                    editable={false}
                    onChangeText={(value) => { this.setState({ currentScannedWifi: value }) }}
                />
                <ImagineTextfield
                    placeholder={'Wifi Password'}
                    value={this.state.txtPassword}
                    secureTextEntry
                    onChangeText={(value) => { this.setState({ txtPassword: value }) }}
                />
            </View>
        )
    }

    renderLoginButton() {
        return (
            <View style={{ marginTop: 20 }}>
                <ImagineButton title={'Save'} onPress={() => {
                    this.connectDeviceToRouter()
                    // this.props.navigation.navigate('Home')
                }} />
            </View>
        )
    }
    _renderItem(item) {
        return (
            <TouchableOpacity style={{ height: 30, width: '100%' }} onPress={() => {
                this.setState({
                    currentScannedWifi: item.SSID
                })
            }}>
                <Text>{item.SSID}</Text>
            </TouchableOpacity>
        )
    }
    //http://imaginesmarthome.com/android_api.php?Apikey=ADMIN@123456789&Action=REGISTER_DEVICE&
    //Device_serial = 00D4E4F0& REG_USER=7600016941 & FAN_CH=1 & SW_CH=1
    registerDevices() {
        try {
            AsyncStorage.getItem(keys.kUSER_DATA).then((user) => {
                let userData = JSON.parse(user)
                const axios = require('axios');
                axios({
                    method: 'get',
                    url: `${api.API_DEVICE_REGISTER}Device_serial=${this.state.currentDeviceSerial}&REG_USER=${userData.mobile}&FAN_CH=${this.state.numberOfFan}&SW_CH=${this.state.numberOfSwitch}`,
                    headers: {
                        'Content-Type': 'Application/json',
                    }
                }).then((response) => {
                    if (response.status == 200) {
                        // alert(response.data["devices"])
                        // console.log(response.data["devices"])
                        if (response.data.devices.length > 0) {
                            if (response.data.devices.length > 0) {
                                var arr = []//this.state.deviceSerials
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
                                    AsyncStorage.setItem(keys.kDEVICE_MAIN_DATA, JSON.stringify(arrResult)).then((result) => {
                                        alert('Device register successful')
                                    }).catch((error) => {
                                        alert('Getting error in device registration')
                                    })
                                }, 200);
                            }
                            // this.props.navigation.navigate("Home", { deviceList: response.data.devices })
                            // DeviceEventEmitter.emit('refreshDevices', response.data.devices);
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
            <View>
                <ImagineNavigationBar
                    title={'Configure Device'}
                    isMenu={true}
                    onLeftPress={() => {
                        this.props.navigation.openDrawer()
                    }}
                />
                <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-around' }}>
                    <TouchableHighlight style={styles.bigButton} onPress={this.reScanOnPress.bind(this)}>
                        <Text style={styles.buttonText}>Add Device</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.bigButton} onPress={() => {
                        this.reScanWifi()
                    }}>
                        <Text style={styles.buttonText}>Scan Wifi</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.bigButton} onPress={() => {

                        this.registerDevices()
                    }}>
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableHighlight>
                </View>
                {this.renderTextFieldView()}
                {this.renderLoginButton()}
                <FlatList style={{ height: 300, width: '100%' }}
                    data={this.state.wifiList}
                    renderItem={({ item }) => this._renderItem(item)}
                    contentContainerStyle={{ marginLeft: 20 }} />
                <WebView
                    source={{ uri: this.state.deviceConfUrl }}
                    style={{ position: 'absolute', bottom: 1000, width: 300, height: 100, backgroundColor: 'transparent' }}
                    onLoadEnd={e => {
                        // this.registerDevices()
                    }}
                />
            </View >
        );
    }
}

