import React, { Component, } from 'react';
import { View, Text, TouchableOpacity, BackHandler } from 'react-native';
import styles from './style';
import { ImagineSwitch } from 'atoms';
import * as icon from 'icons';
import Slider from "react-native-slider";

// import firebase from 'react-native-firebase'

export default class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            switch1On: true,
            switch2On: true,
            switch3On: true,
            switch4On: true,
            sliderValue: 0,
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

    renderBackButton() {
        return (
            <TouchableOpacity style={{ position: 'absolute', top: 40, left: 20 }} onPress={() => {
                this.props.navigation.goBack()
            }}>
                <Text style={{ fontSize: 15 }}>{`Back`}</Text>
            </TouchableOpacity>
        )
    }
    getVal(val) {
        console.log('hi')
    }
    render() {
        return (
            <View style={styles.container}>
                {this.renderBackButton()}
                {/* <ImagineSwitch
                    style={{ height: 200, width: 150 }}
                    source={this.state.switch1On ? icon.IC_BLACK_S_OFF : icon.IC_BLACK_S_ON} onPress={() => {
                        this.setState({
                            switch1On: !this.state.switch1On
                        })
                    }} />
                <ImagineSwitch
                    style={{ height: 200, width: 150 }}
                    source={this.state.switch2On ? icon.IC_HOME_S_OFF : icon.IC_HOME_S_ON} onPress={() => {
                        this.setState({
                            switch2On: !this.state.switch2On
                        })
                    }} /> */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', }}>
                    <ImagineSwitch
                        style={{ height: 150, width: 150, marginRight: 20, marginBottom: 20 }}
                        source={this.state.switch1On ? icon.IC_CIRCLE_S_OFF : icon.IC_CIRCLE_S_ON} onPress={() => {
                            this.setState({
                                switch1On: !this.state.switch1On
                            })
                        }} />
                    <ImagineSwitch
                        style={{ height: 150, width: 150, }}
                        source={this.state.switch2On ? icon.IC_CIRCLE_S_OFF : icon.IC_CIRCLE_S_ON} onPress={() => {
                            this.setState({
                                switch2On: !this.state.switch2On
                            })
                        }} />
                    <ImagineSwitch
                        style={{ height: 150, width: 150, marginRight: 20, }}
                        source={this.state.switch3On ? icon.IC_CIRCLE_S_OFF : icon.IC_CIRCLE_S_ON} onPress={() => {
                            this.setState({
                                switch3On: !this.state.switch3On
                            })
                        }} />
                    <ImagineSwitch
                        style={{ height: 150, width: 150, }}
                        source={this.state.switch4On ? icon.IC_CIRCLE_S_OFF : icon.IC_CIRCLE_S_ON} onPress={() => {
                            this.setState({
                                switch4On: !this.state.switch4On
                            })
                        }} />
                </View>
                <Slider
                    style={{ width: 300, height: 100 }}
                    step={1}
                    minimumValue={0}
                    maximumValue={4}
                    value={this.state.sliderValue}
                    onValueChange={val => this.setState({ sliderValue: val })}
                    onSlidingComplete={val => this.getVal(val)}
                />
            </View>
        );
    }
}
