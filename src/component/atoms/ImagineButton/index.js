import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styles from './style';
export default class ImagineButton extends Component {
    render() {
        return (
            <TouchableOpacity style={styles.container}
                onPress={this.props.onPress}>
                <Text>{this.props.title}</Text>
            </TouchableOpacity>
        );
    }
}
