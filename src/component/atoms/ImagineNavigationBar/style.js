import { StyleSheet } from 'react-native';
import * as color from '../../../constants/common';

export default styles = StyleSheet.create({
    container: {
        height: 50,
        width: '100%',
        backgroundColor: color.APP_PRIMARY,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    leftContainer: {
        position: 'absolute',
        left: 0,
        height: '100%',
        aspectRatio: 1.0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    leftImage: {
        height: 20,
        width: 20
    }
});
