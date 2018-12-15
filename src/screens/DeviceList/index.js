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
    Linking
} from 'react-native';
import { ImagineTextfield, ImagineButton } from 'atoms';

import wifi from 'react-native-android-wifi';

export default class DeviceList extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
            currentScannedWifi: ''
        };

    }

    componentDidMount() {
        console.log(wifi);
        this.askForUserPermissions();
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
                        currentDeviceSerial: filteredDevices[0].SSID.slice(-6),// finding last 6 character
                        numberOfSwitch: filteredDevices[0].SSID.charAt(9),//finding number of switch
                        numberOfFan: filteredDevices[0].SSID.charAt(12)//finding number of fans
                    })
                    this.findAndConnect()
                } else {
                    alert('No Imagine device found')
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
        Linking.openURL(`http://192.168.4.1/wifisave?s=${this.state.currentScannedWifi}&p=${this.state.txtPassword}`).catch(err => console.error('An error occurred', err));
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
            <View style={{ width: '100%', marginTop: 100 }}>
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

    render() {
        return (
            <View>
                {/* <View style={styles.container}>
                    <Text style={styles.title}>React Native Android Wifi Example App</Text>
                    <View style={styles.instructionsContainer}>
                        <Text style={styles.instructionsTitle}>Get all wifi networks in range</Text>
                        <TouchableHighlight style={styles.bigButton} onPress={this.getWifiNetworksOnPress.bind(this)}>
                            <Text style={styles.buttonText}>Available WIFI Networks</Text>
                        </TouchableHighlight>
                    </View>
                </View> */}
                <View style={{ flex: 1 }}>
                    <TouchableHighlight style={styles.bigButton} onPress={this.reScanOnPress.bind(this)}>
                        <Text style={styles.buttonText}>Add Device</Text>
                    </TouchableHighlight>
                </View>

                <TouchableHighlight style={[styles.bigButton, { left: 20 }]} onPress={() => {
                    this.reScanWifi()
                }}>
                    <Text style={styles.buttonText}>Scan Wifi</Text>
                </TouchableHighlight>

                {this.renderTextFieldView()}
                {this.renderLoginButton()}
                <FlatList style={{ height: 300, width: '100%' }}
                    data={this.state.wifiList}
                    renderItem={({ item }) => this._renderItem(item)}
                    contentContainerStyle={{ marginLeft: 20 }} />
            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: '#F5FCFF',
        marginBottom: 100
    },
    row: {
        flexDirection: 'row'
    },
    title: {
        fontSize: 20,
    },
    instructionsContainer: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
    },
    instructionsTitle: {
        marginBottom: 10,
        color: '#333333'
    },
    instructions: {
        color: '#333333'
    },
    button: {
        padding: 5,
        width: 120,
        alignItems: 'center',
        backgroundColor: 'blue',
        marginRight: 15,
    },
    bigButton: {
        position: 'absolute',
        right: 20,
        top: 40,
        padding: 5,
        width: 100,
        alignItems: 'center',
        backgroundColor: 'blue',
        marginRight: 15,
    },
    buttonText: {
        color: 'white'
    },
    answer: {
        marginTop: 5,
    }
});