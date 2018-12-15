import React, { Component } from 'react';
import { View, Text, BackHandler, TouchableOpacity } from 'react-native';
import { ImagineTextfield, ImagineButton } from 'atoms';
import * as title from '../../constants/titles';
import * as common from '../../constants/common';
import styles from './style';
export default class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            mobile: '',
            password: '',
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
                    placeholder={title.PLACEHOLDER_PASSWORD}
                    value={this.state.password}
                    secureTextEntry
                    onChangeText={(value) => { this.setState({ password: value }) }}
                />
            </View>
        )
    }
    renderLoginButton() {
        return (
            <View style={{ marginTop: 20 }}>
                <ImagineButton title={'Login'} onPress={() => {
                    this.props.navigation.navigate('Home')
                }} />
            </View>
        )
    }
    renderRegiterButton() {
        return (
            <TouchableOpacity style={{ marginTop: 5, padding: 5 }} onPress={() => {
                this.props.navigation.navigate('Register')
            }}>
                <Text style={{ fontSize: 15 }}>Register Here</Text>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={{ marginBottom: 20, fontSize: 22, fontWeight: '600' }}>Login</Text>
                {this.renderTextFieldView()}
                {this.renderLoginButton()}
                {this.renderRegiterButton()}
            </View>
        );
    }
}
