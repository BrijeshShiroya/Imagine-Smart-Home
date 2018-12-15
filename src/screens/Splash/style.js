import { StyleSheet } from 'react-native';
import * as common from '../../constants/common';

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 40,
        fontWeight: '800',
        color: common.APP_PRIMARY

    }
});
