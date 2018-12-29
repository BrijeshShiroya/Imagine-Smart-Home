import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, AsyncStorage } from 'react-native';
import styles from './style';
import * as icon from 'icons';
import * as keys from '../../constants/keys';


export default class Splash extends Component {

    componentWillMount() {
        try {
            AsyncStorage.getItem(keys.kUSER_DATA).then((user) => {
                setTimeout(() => {
                    if (user) {
                        this.props.navigation.navigate('DrawerMenu')
                    } else {
                        this.props.navigation.navigate('Login')
                    }
                }, 100);
            })
        } catch (error) {
            alert(error)
        }
    }

    render() {
        return (
            <View style={styles.container} >
                <View style={{ marginBottom: 100, alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                        resizeMode={'contain'}
                        style={{ height: 150, width: 300 }}
                        source={icon.IC_LOGO} />
                    <Text style={styles.title}>Smart Home</Text>
                </View>
            </View>
        );
    }
}
