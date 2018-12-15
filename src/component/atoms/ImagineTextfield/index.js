import React from 'react';
import { View, TextInput } from 'react-native';
import styles from './style';

export default class ImagineTextfield extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            text: ''
        }
    }

    render() {
        return (
            <TextInput
                {...this.props}
                style={[styles.textfield, this.props.style]}
            />
        );
    }
}