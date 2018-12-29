import React, { Component } from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import styles from './style';
import * as icon from 'icons';
export default class ImagineNavigationBar extends Component {
    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.leftContainer}
                    onPress={() => {
                        this.props.onLeftPress()
                    }}>

                    <Image style={styles.leftImage}
                        source={this.props.isMenu ? icon.IC_MENU : icon.IC_BACK} />
                </TouchableOpacity>
                <Text style={{ color: 'white' }}>{this.props.title}</Text>
            </View>
        );
    }
}
