import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import BackgroundTimer from 'react-native-background-timer';

//redux import
import { useSettings } from "../contexts/SettingsContext";
import { useSelector } from "react-redux";

//notification service imports
import notifee, { EventType } from '@notifee/react-native';
import { cancelAllNotifications, requestNotificationPermission, sendLocalNotification } from "../services/notification/push-notification-service";
import { isGpsEnable, stopBackgroundLocationService } from "../services/location/background-location-service";


export const NotificationHandler = () => {

    const { settingsData } = useSettings();
    const locations = useSelector((state) => state.locations.items);
    //const { items } = useSelector((state) => state.locations.items);

    //const [latestIntervalId, setLatestIntervalId] = useState<number | null>(null)

    const locationsRef = useRef(locations);

    const removeAllSubscribes = useCallback(() => {

        cancelAllNotifications();
        stopBackgroundLocationService();
        // if (latestIntervalId !== null) {
        //     BackgroundTimer.clearInterval(latestIntervalId);
        // }

        // BackgroundTimer.stop();
        //console.log('Background timer stopped.');

    }, []);


    useLayoutEffect(() => {

        const fetchPermission = async () => {
            await requestNotificationPermission()
        }

        fetchPermission();

    }, [])

    useEffect(() => {
        let timerId: number;

        if (settingsData.isNotificationEnabled && settingsData.isTrackerEnabled && isGpsEnable()) {
            //if (latestIntervalId === null) {
            console.log('Set Interval timer for push notification after ' + settingsData.notificationRepeatIntervalInMinutes)
            timerId = BackgroundTimer.setInterval(() => {
                console.log('Background timer triggered notification check.');
                sendLocalNotification(locationsRef.current, settingsData.notificationRepeatIntervalInMinutes, settingsData.intervalInSeconds);
            }, settingsData.notificationRepeatIntervalInMinutes * 60 * 1000);

            //setLatestIntervalId(intervalId)
            //  }
        } else {
            console.log("Calling cancelAllNotifications from NotificationHandler.tsx");
            cancelAllNotifications();
        }

        return () => {
            if (timerId) {
                BackgroundTimer.clearInterval(timerId);
            }

            BackgroundTimer.stop();
            console.log('Background timer stopped.');
        }

    }, [settingsData]);


    useEffect(() => {
        console.log("A new location added " + locations.length);
        locationsRef.current = locations;
    }, [locations]);


    useEffect(() => {
        const unsubscribeOnForegroundEvent = notifee.onForegroundEvent(({ type, detail }) => {
            switch (type) {
                case EventType.DISMISSED:
                    console.log('onForegroundEvent User dismissed notification', detail.notification);
                    break;
                case EventType.PRESS:
                    console.log('onForegroundEvent User pressed notification', detail.notification);
                    removeAllSubscribes();
                    break;
            }
        });

        notifee.onBackgroundEvent(async ({ type, detail }) => {
            if (type === EventType.PRESS) {
                console.log('onBackgroundEvent User pressed the notification.', detail.notification);
                removeAllSubscribes();
            }
        });

        return () => {
            unsubscribeOnForegroundEvent();
            removeAllSubscribes();
        }

    }, [removeAllSubscribes]);




    // const removeAllSubscribes = () => {
    //     cancelAllNotifications();
    //     stopBackgroundLocationService();
    //     removeBackgroundTimer();
    // }

    return null;

}