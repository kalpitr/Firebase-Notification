import  messaging  from '@react-native-firebase/messaging'
// import type {Notification,NotificationOpen} from 'react-native-firebase'
import { Platform } from 'react-native'

class FCMService {
    register = (onRegister,onNotification,onOpenNotification) => {
        this.checkPermission(onRegister)
        this.createNotificationListeners(onRegister,onNotification,onOpenNotification)
    
    }

    registerAppWithFCM = async() => {
        if(Platform.OS === "ios"){
            await messaging().registerDeviceForRemoteMessages();
            await messaging().setAutoInitEnabled(true)
        }
        
    }

    checkPermission = (onRegister) => {
        messaging().hasPermission()
        .then(enabled => {
            if(enabled) {
                //User has permission
                this.getToken(onRegister)
            }
            else{
                //User Dont have permission
                this.requestPermission(onRegister)
                }
            }).catch(error => {
                console.log("Permission Rejected",error)
            })
    } 

    getToken = (onRegister) => {
        messaging().getToken()
        .then(fcmToken => {
            if(fcmToken) {
                onRegister(fcmToken)
            }
            else{
                console.log("User Dont ave a Device Token")
            }
        }).catch(error => {
            console.log("get token rejected", error)
        })
    }
        
        requestPermission = (onRegister) => {
            messaging().requestPermission()
            .then(() => {
                this.getToken(onRegister)
            }).catch(error => {
                console.log("Request Permission Rejected",error)
            })
        }

        deleteToken = () => {
            console.log("Delete Token")
            messaging().deleteToken()
            .catch(error => {
                console.log("Delete token error",error)
            })
        }

        createNotificationListeners = (onRegister, onNotification,onOpenNotification) => {

            messaging().onNotificationOpenedApp(remoteMessage => {
                console.log("onNotificationOpenedApp notification caused to open app")
                if(remoteMessage){
                    const notification = remoteMessage.notification
                    onOpenNotification(notification)
                }
            });

            //When the application is opened from a quite state.
            messaging().getInitialNotification().then(remoteMessage => {
                    console.log("getInitialNotification notification caused to open app")
                    if(remoteMessage){
                        const notification = remoteMessage.notification
                        onOpenNotification(notification)
                    }
            })

            //Foreground state messages 
            this.messageListner = messaging().onMessage(async remoteMessage => {
                console.log("A new FCM Message Arrived",remoteMessage)
                if(remoteMessage){
                    let notification = null
                    if(Platform.OS === "ios") {
                        notification = remoteMessage.data.notification
                    
                }else{
                    notification =  remoteMessage.notification
                }
                onOpenNotification(notification)
            }
            })

            //Trigger when we have new notification
            messaging().onTokenRefresh(fcmToken => {
                console.log("New Token Refresh",fcmToken)
                onRegister(fcmToken)
            })

            //Trigger when perticular notification has been recieved in foreground
            // this.notificationListener = firebase.notifications()
            // .onNotification((notification: Notification) => {
            //         onNotification(notification)
            // })

            //If your app is in background, you can listen for when a notification
            //is clicked / tapped / opened as follows
            // this.notificationOpenedListener = firebase.notifications()
            // .onNotificationOpened((notificationOpen : NotificationOpen) => {
            //     onOpenNotification(notification)
            // })

            //If your app is closed, you can check if it was opened by a notification
            //being clicked / tapped / opened as follows
            // firebase.notifications().getInitialNotification()
            // .then(notificationOpen => {
            //     if(notificationOpen){
            //         const notification :Notification = notificationOpen.notification
            //         onOpenNotification(notification)
            //     }
            // })

            //Triggered for data only payload in foreground
            // this.messageListner = firebase.messaging().onMessage((message) => {
            //     onNotification(message)
            // })

            //Triggered when have new token
            // this.onTokenRefreshListner = firebase.messaging().onTokenRefresh(fcmToken => {
            //     console.log("New Token Refresh",fcmToken)
            //     onRegister(fcmToken)
            // })
        }
        unRegister = () => {
            // this.notificationListener()
            // this.notificationOpenedListener()
            this.messageListner()
            // this.onTokenRefreshListner()
        }
        // buildChannel = (obj) => {
        //     return new firebase.notifications.Android.Channel(
        //         obj.channelID,obj.channelName,
        //         firebase.notifications.Android.Importance.High)
        //         .setDescription(obj.channelDes)
        //     }
        // buildNotification = (obj) => {
        //     //For Android
        //     firebase.notification().android.createChannel(obj.channel)

        //     // For Android Aand IOS

        //     return new firebase.notifications.Notification()
        //     .setSound(obj.sound)
        //     .setNotificationId(obj.dataId)
        //     .setTitle(obj.title)
        //     .setBody(obj.content)
        //     .setData(obj.data)

        //     //For Android 
        //     .android.setChannelId(obj.channel.channelID)
        //     .android.setLargeIcon(obj.largeicon)
        //     .android.setSmallIcon(obj.smallicon)
        //     .android.setColor(obj.colorBgIcon)
        //     .android.setPriority(firebase.notifications.Android.Priority.High)
        //     .android.setVibrate(obj.vibrate)
        //     //.android.setAutocomplete(true) Auto cancel after recieve notification
        // }

        //     ScheduleNotification = ( notification,days,minutes) => {
        //         const date = new Date()
        //         if(!days) {
        //             date.setDate(date.getDate() + days)
        //         }
        //         if(minutes) {
        //             date.setMinutes(date.getMinutes() + minutes)
        //         }
        //         firebase.notifications().scheduleNotification(notification, {fireDate : date.getTime()})
        //     }

        //     displayNotification = (notification) => {
        //         firebase.notifications().displayNotification(notification)
        //         .catch(error => console.log("Display Notification error",error))
        //     }

        //     removedDeliveredNotification = (notification) => {
        //         firebase.notifications()
        //         .removedDeliveredNotification(notification,notificationId)
        //     }
    }

    export const fcmService = new FCMService()