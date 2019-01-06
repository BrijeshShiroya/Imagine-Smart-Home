import { StyleSheet } from 'react-native';
import * as common from '../../constants/common';

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: '#F5FCFF',
        marginBottom: 100
    },
    row: {
        flexDirection: 'row'
    },
    title: {
        fontSize: 20,
    },
    instructionsContainer: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
    },
    instructionsTitle: {
        marginBottom: 10,
        color: '#333333'
    },
    instructions: {
        color: '#333333'
    },
    button: {
        padding: 5,
        width: 120,
        alignItems: 'center',
        backgroundColor: 'blue',
        marginRight: 15,
    },
    bigButton: {
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: 'center',
        backgroundColor: common.APP_PRIMARY,
        color: 'white',
        borderRadius: 5
    },
    buttonText: {
        color: 'white'
    },
    answer: {
        marginTop: 5,
    }
});
