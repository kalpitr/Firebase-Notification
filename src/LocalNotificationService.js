import PushNotification from "react-navtive-push-notification";
import { Platform } from 'react-native'
import { notifications } from "react-native-firebase";


class LocalPushNotification {
    
    configure = (onOpenNotification) => {
        PushNotification.configure({
            onRegister: function (token) {
                console.log("[LocalNotificationService] onRegister",token)
            },
            onNotification: function (notification) {
                console.log("[LocalNotificationService] onNotification",notification)
                if(!notification?.data) {
                    return
                }
                notification.userInteraction = true;
                onOpenNotification(Platform.OS === 'ios' ? notification.data.item : notification.data);

                //Only call callback if not from foreground
                if(Platform.OS === 'ios') {
                    notification.finish(PushNotificationIOS.FetchResult.NoData)
                }
            },

             // IOS ONLY (optional): default: all - Permissions to register.
                permissions: {
                    alert: true,
                    badge: true,
                    sound: true,
                },

                // Should the initial notification be popped automatically
                // default: true
                popInitialNotification: true,

                /**
                 * (optional) default: true
                 * - Specified if permissions (ios) and token (android and ios) will requested or not,
                 * - if not, you must call PushNotificationsHandler.requestPermissions() later
                 * - if you are not using remote notification or do not have Firebase installed, use this:
                 *     requestPermissions: Platform.OS === 'ios'
                 */
                requestPermissions: true,
        })
    }
    unregister = () => {
        PushNotification:this.unregister()
    }

    showNotification = (id,title,message,data = {},options = {}) => {
        PushNotification.localNotification({
            ...this.buildAndroidNotification(id,title,message,data,options),
            title : title || "",
            message : message || "",
            playSound : options.playSound || false,
            soundName : options.soundName || 'default',
            userInteraction : false  /// boolean if the condition was opened by the user from the notification

        })
    }

    buildAndroidNotification = (id,title,message,data = {} ,options = {}) => {
        return {
            id : id,
            autoCancel : true,
            largeIcon : options.largeIcon || "ic_launcher",
            smallIcon : options.smallIcon || "ic_notification",
            bigText : message || '',
            subText : title || '',
            vibrate : options.vibrate || true,
            vibration : options.vibration || 300,
            priority : options.priority || " high",
            importance : options.importance || "high", // (options) set notification importance , default high
            data : data,

        }
    }

    cancelAllLocalNotification = () => {
        if(Platform.OS === "ios") {
            PushNotificationIOS.removedAllDeliveredNotification();
        }else {
            PushNotification.cancelAllLocalNotification();
        }
    }

    removedDeliveredNotificationById = (notificationId) => {
        console.log("[LocalNotificationService] removeDeliveredNotificationById: ",notificationId);
        PushNotification.cancelLocalNotfication({id : `${notificationId}`})
    }
}

export const LocalNotificationService = new LocalNotificationService()