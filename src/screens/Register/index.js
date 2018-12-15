import React, { Component } from 'react';
import { View, BackHandler, TouchableOpacity, Text } from 'react-native';
import { ImagineTextfield, ImagineButton, ImagineLoader } from 'atoms';
import * as title from '../../constants/titles';
import * as api from '../../constants/api';

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
                    onChangeText={(value) => { this.setState({ mobile: value }) }}
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
                    this.setState({
                        isLoading: true
                    })
                    this.registerPerform()
                    // this.props.navigation.navigate('Login')
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
    registerPerform() {
        if (this.state.mobile != '' && this.state.password != '' && this.state.cpassword != '') {
            const axios = require('axios');
            axios({
                method: 'get',
                url: `${api.API_REGISTER}REG_PASS=${this.state.password}&REG_USER=${this.state.mobile}`,
                headers: {
                    'Content-Type': 'Application/json',
                }
            }).then((response) => {
                this.setState({
                    isLoading: false
                })
                if (response.status == 200) {
                    // console.log(JSON.parse(response.data))
                    if (response.data.Error == 'Success') {
                        alert('Register Success')
                        this.props.navigation.navigate('Login')
                    } else {
                        alert(response.data.Error)
                    }
                }
            })
        }
    }
    render() {
        return (
            <View style={styles.container}>
                {this.renderBackButton()}
                {this.renderTextFieldView()}
                {this.renderRegisterButton()}
                <ImagineLoader isVisible={this.state.isLoading} />
            </View>
        );
    }
}
