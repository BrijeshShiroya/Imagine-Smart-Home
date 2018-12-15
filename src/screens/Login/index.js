import React, { Component } from 'react';
import { View, Text, BackHandler, TouchableOpacity } from 'react-native';
import { ImagineTextfield, ImagineButton, ImagineLoader } from 'atoms';
import * as title from '../../constants/titles';
import * as common from '../../constants/common';
import styles from './style';
import * as api from '../../constants/api';
export default class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            mobile: '9558050804',
            password: '111111',
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
                    this.setState({
                        isLoading: true
                    })
                    this.loginPerform()
                    // this.props.navigation.navigate('Home')
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

    loginPerform() {
        if (this.state.mobile != '' && this.state.password != '') {
            const axios = require('axios');
            axios({
                method: 'get',
                url: `${api.API_LOGIN}REG_PASS=${this.state.password}&REG_USER=${this.state.mobile}`,
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
                        this.props.navigation.navigate('Home')
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
                <Text style={{ marginBottom: 20, fontSize: 22, fontWeight: '600' }}>Login</Text>
                {this.renderTextFieldView()}
                {this.renderLoginButton()}
                {this.renderRegiterButton()}
                <ImagineLoader isVisible={this.state.isLoading} />
            </View>
        );
    }
}
