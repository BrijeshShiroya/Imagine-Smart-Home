import React, { Component, } from 'react';
import { View, Platform } from 'react-native';
import styles from './style';
// import firebase from 'react-native-firebase'

export default class Home extends Component {

    constructor(props) {
        super(props)
        setTimeout(() => {
            // this.checkPermission()
        }, 200);
    }

    componentWillUnmount() {
        this.unsubscribeFromNotificationListener()
    }

    //TODO Firebase notification 

    async checkPermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
        }
        const channel = new firebase.notifications.Android.Channel(
            'channelId',
            'Channel Name',
            firebase.notifications.Android.Importance.Max
        ).setDescription('A natural description of the channel');
        firebase.notifications().android.createChannel(channel);

        firebase.notifications().getInitialNotification()
            .then((notificationOpen) => {
                if (notificationOpen) {
                    // App was opened by a notification
                    // Get the action triggered by the notification being opened
                    const action = notificationOpen.action;
                    // Get information about the notification that was opened
                    const notification = notificationOpen.notification;
                }
            });


        // the listener returns a function you can use to unsubscribe
        this.unsubscribeFromNotificationListener = firebase.notifications().onNotification((notification) => {
            if (Platform.OS === 'android') {
                // alert('unsubscribeFromNotificationListener - android1s')
                const localNotification = new firebase.notifications.Notification({
                    sound: 'default',
                    show_in_foreground: true,
                })
                    .setNotificationId(notification.notificationId)
                    .setTitle(notification.title)
                    .setSubtitle(notification.subtitle)
                    .setBody(notification.body)
                    .setData(notification.data)
                    .android.setChannelId('channelId') // e.g. the id you chose above
                    .android.setColor('#000000') // you can set a color here
                    .android.setGroup(notification.notificationId)
                    .android.setPriority(firebase.notifications.Android.Priority.High);


                firebase.notifications()
                    .displayNotification(localNotification)
                    .catch(err => console.error(err));

            } else if (Platform.OS === 'ios') {
                const localNotification = new firebase.notifications.Notification()
                    .setNotificationId(notification.notificationId)
                    .setTitle(notification.title)
                    .setSound('default')
                    .setSubtitle(notification.subtitle)
                    .setBody(notification.body)
                    .setData(notification.data)
                    .ios.setBadge(notification.ios.badge);

                firebase.notifications()
                    .displayNotification(localNotification)
                    .catch(err => console.error(err));

                // alert('Local notification')
            }
        });

        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            // alert('Remote notification from killed state to foreground state')
            // App was opened by a notification
            // Get the action triggered by the notification being opened from killed state to foreground
            const action = notificationOpen.action;
            // Get information about the notification that was opened
            const notification = notificationOpen.notification;
            if (notification.data) { // && Platform.OS !== 'ios'
                setTimeout(() => {
                    // alert('getInitialNotification: ' + JSON.stringify(notification.data));
                    this.handleNavigation(notification.data);
                }, 100);
            }
            // alert(JSON.stringify(notification.data))
        }

        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            // Get the action triggered by the notification being opened from background state to foreground
            // alert('Remote notification from background state to foreground state')
            const action = notificationOpen.action;
            // Get information about the notification that was opened
            const notification = notificationOpen.notification;
            if (notification.data) { // && Platform.OS !== 'ios'
                setTimeout(() => {
                    // alert('getInitialNotification: ' + JSON.stringify(notification.data));
                    this.handleNavigation(notification.data);
                }, 100);
            }
        });
    }

    //3
    async getToken() {
        // let fcmToken = await AsyncStorage.getItem('fcmToken', value);
        // if (!fcmToken) {
        let fcmToken = await firebase.messaging().getToken();
        // alert(fcmToken)
        if (fcmToken) {
            // user has a device token
            console.log(fcmToken)
        }
        // }
    }

    //2
    async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            // User has authorised
            this.getToken();
        } catch (error) {
            // User has rejected permissions
            console.log('permission rejected');
        }
    }
    render() {
        return (
            <View style={styles.container} />
        );
    }

    handleNavigation(notif) {
        alert(JSON.stringify(notif))
    }
}
