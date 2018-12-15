import React, { Component } from 'react';
import { View, BackHandler, TouchableOpacity, Text } from 'react-native';
import { ImagineTextfield, ImagineButton } from 'atoms';
import * as title from '../../constants/titles';

import styles from './style';
export default class Register extends Component {

    constructor(props) {
        super(props)
        this.state = {
            mobile: '',
            password: '',
            cpassword: '',
            isLoading: false
        }
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

    renderTextFieldView() {
        return (
            <View style={{ width: '100%' }}>
                <ImagineTextfield
                    style={{ marginBottom: 15 }}
                    placeholder={title.PLACEHOLDER_MOBILE}
                    value={this.state.mobile}
                    keyboardType='number-pad'
                    maxLength={10}
                    onChangeText={(value) => { this.setState({ email: value }) }}
                />
                <ImagineTextfield
                    style={{ marginBottom: 15 }}
                    placeholder={title.PLACEHOLDER_PASSWORD}
                    value={this.state.password}
                    secureTextEntry
                    onChangeText={(value) => { this.setState({ password: value }) }}
                />
                <ImagineTextfield
                    placeholder={title.PLACEHOLDER_CONFIRM_PASSWORD}
                    value={this.state.cpassword}
                    secureTextEntry
                    onChangeText={(value) => { this.setState({ cpassword: value }) }}
                />
            </View>
        )
    }
    renderRegisterButton() {
        return (
            <View style={{ marginTop: 20 }}>
                <ImagineButton title={'Register'} onPress={() => {
                    this.props.navigation.navigate('Login')
                }} />
            </View>
        )
    }
    renderBackButton() {
        return (
            <TouchableOpacity style={{ position: 'absolute', top: 40, left: 20 }} onPress={() => {
                this.props.navigation.goBack()
            }}>
                <Text style={{ fontSize: 15 }}>{`Back`}</Text>
            </TouchableOpacity>
        )
    }
    render() {
        return (
            <View style={styles.container}>
                {this.renderBackButton()}
                {this.renderTextFieldView()}
                {this.renderRegisterButton()}
            </View>
        );
    }
}
