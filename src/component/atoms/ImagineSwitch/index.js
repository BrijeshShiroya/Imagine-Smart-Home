import React, { Component } from 'react';
import { Text, TouchableOpacity, Image } from 'react-native';
import styles from './style';
export default class ImagineSwitch extends Component {
    render() {
        return (
            <TouchableOpacity
                style={[{ height: 75, width: 100 }, this.props.style]}
                onPress={this.props.onPress}>
                <Image style={{ height: '100%', width: '100%' }}
                    resizeMode={'contain'}
                    source={this.props.source}
                />
                <Text>{this.props.title}</Text>
            </TouchableOpacity>
        );
    }
}
