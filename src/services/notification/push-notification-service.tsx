import notifee, { AndroidImportance, TriggerType, RepeatFrequency, AuthorizationStatus } from '@notifee/react-native';
import { PermissionsAndroid, Platform } from 'react-native';
import { APP_CONSTANTS } from '../../config/constants';
import { LocationItem } from '../../types/LocationItem';
import { isUserStationary } from '../../utils/Utils';

// Request permissions (required for iOS)
export const requestNotificationPermission = async () => {
    if (Platform.OS === 'ios') {
        const settings = await notifee.requestPermission();
        console.log('Need permission for iOS.');
        if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
            console.log('Permission settings:', settings);
        } else {
            console.log('User declined permissions');
        } return;
    } else if (Platform.OS === 'android' && Platform.Version >= 33) { // For Android 13+
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    }

}

const createNotificationChannel = async (): Promise<string> => {
    const channelId = await notifee.createChannel({
        id: APP_CONSTANTS.NOTIFICATION.CHANNEL_ID,
        name: APP_CONSTANTS.NOTIFICATION.CHANNEL_NAME,
        importance: AndroidImportance.HIGH,
    });
    return channelId;
}

export const scheduleLocalNotification = async (repeatIntervalInMins: number) => {
    if (!repeatIntervalInMins || repeatIntervalInMins <= 0) {
        console.log('Invalid repeat interval. Notification not scheduled.');
        return null;
    }

    await requestNotificationPermission();

    const channelId = await createNotificationChannel();

    const date = new Date(Date.now());
    date.setMinutes(date.getMinutes() + repeatIntervalInMins); // First trigger after repeatIntervalInMins minutes

    const trigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: date.getTime(), // Initial fire time
        repeatInterval: repeatIntervalInMins,
        repeatIntervalUnit: RepeatFrequency.DAILY,
    };


    const notificationId = await notifee.createTriggerNotification(
        {
            title: 'Scheduled Reminder for Location',
            body: 'Reminder to check your location-based tasks.',
            android: {
                channelId,
                smallIcon: 'ic_launcher',
            },
        },
        trigger,
    );

    return notificationId;
}


export const sendLocalNotification = async (list: LocationItem[], mins: number, seconds: number) => {

    if (isUserStationary(list, mins, seconds)) {
        console.log("Calling sendLocalNotification from NotificationHandler.tsx");

        const channelId = await createNotificationChannel();

        // Display a notification
        await notifee.displayNotification({
            title: 'My Location Reminder',
            body: 'You have a location-based reminder!, You have been not moving for a while.',
            android: {
                channelId,
                smallIcon: 'real_time_tracking',
                pressAction: {
                    id: 'default',
                },
            },
        });
    }
}

export const cancelNotification = (notificationId: string) => {
    console.log("Calling cancelNotification with notificationId" + notificationId)
    notifee.cancelNotification(notificationId)
}


export const cancelAllNotifications = async () => {
    console.log('Cancelling all notifications...');
    await notifee.cancelAllNotifications();
    notifee.deleteChannel(APP_CONSTANTS.NOTIFICATION.CHANNEL_ID);
}