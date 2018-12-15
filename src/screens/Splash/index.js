import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import styles from './style';
import * as icon from 'icons';


export default class Splash extends Component {


    componentWillMount() {
        setTimeout(() => {
            this.props.navigation.navigate('Home')
        }, 2500);
    }
    render() {
        return (
            <View style={styles.container}>
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
