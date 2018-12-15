import { StyleSheet } from 'react-native';
import * as common from '../../../constants/common';

export default styles = StyleSheet.create({
    container: {
        backgroundColor: '#00000050',//'transparent'//,
        position: 'absolute',
        height: common.SCREEN_HEIGHT,
        width: common.SCREEN_WIDTH,
        justifyContent: 'center',
        alignItems: 'center'
    },
    dismiss: {
        backgroundColor: 'red',
        position: 'absolute',
        height: 0,
        width: 0,
    }
});
