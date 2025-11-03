import { useEffect, useLayoutEffect, useState } from "react";
import BackgroundTimer from 'react-native-background-timer';

//redux import
import { useSettings } from "../contexts/SettingsContext";
import { useSelector } from "react-redux";

//notification service imports
import notifee, { EventType } from '@notifee/react-native';
import { cancelAllNotifications, requestNotificationPermission, sendLocalNotification } from "../services/push-notification-service";
import { stopBackgroundLocationService } from "../services/background-location-service";
import { areLatestRangeIndicesEqual } from "../utils/Utils";

const MIN = 60

export const NotificationHandler = () => {

    const { settingsData } = useSettings();
    const locations = useSelector((state) => state.locations.list);

    const [latestIntervalId, setLatestIntervalId] = useState<number | null>(null)

    useLayoutEffect(() => {

        const fetchPermission = async () => {
            await requestNotificationPermission()
        }

        fetchPermission();

    }, [])

    useEffect(() => {

        if (settingsData.isNotificationEnabled && settingsData.isTrackerEnabled) {
            //if (latestIntervalId === null) {
            console.log('Set Interval timer for push notification after ' + settingsData.notificationRepeatIntervalInMinutes)
            const intervalId = BackgroundTimer.setInterval(() => {
                console.log('Background timer triggered notification check.');
                if (isUserStationary()) {
                    console.log("Calling sendLocalNotification from NotificationHandler.tsx");
                    sendLocalNotification();
                }
            }, settingsData.notificationRepeatIntervalInMinutes * MIN * 1000);

            setLatestIntervalId(intervalId)
            // }
        } else {
            console.log("Calling cancelAllNotifications from NotificationHandler.tsx");
            cancelAllNotifications();
            removeBackgroundTimer()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settingsData.isNotificationEnabled, settingsData.isTrackerEnabled, settingsData.notificationRepeatIntervalInMinutes]);



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


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const removeAllSubscribes = () => {
        cancelAllNotifications();
        stopBackgroundLocationService();
        removeBackgroundTimer();
    }

    const isUserStationary = () => {
        const range = Math.floor((settingsData.notificationRepeatIntervalInMinutes * MIN) / settingsData.intervalInSeconds);
        return areLatestRangeIndicesEqual(locations, range)
    }

    function removeBackgroundTimer() {
        if (latestIntervalId !== null) {
            BackgroundTimer.clearInterval(latestIntervalId);
        }

        BackgroundTimer.stop();
        console.log('Background timer stopped.');
    }
    return null;

}