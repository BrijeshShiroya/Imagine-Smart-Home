import React, { Component } from 'react';

import { View, ActivityIndicator } from 'react-native';
import styles from './style';
import * as common from '../../../constants/common';
export default class ImagineLoader extends Component {
    render() {
        const { isVisible } = this.props;
        return (
            isVisible ?
                <View style={styles.container} >
                    <ActivityIndicator size="large" color={common.APP_PRIMARY} />
                </View> : null
        );
    }
}