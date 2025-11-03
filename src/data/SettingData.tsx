import { APP_CONSTANTS } from "../config/constants";

export interface SettingData {
    intervalInSeconds: number;
    isNotificationEnabled: boolean;
    isTrackerEnabled: boolean;
    continueOnTerminateEnabled: boolean;
    notificationRepeatIntervalInMinutes: number;

}

export const defaultSettingData: SettingData = {
    intervalInSeconds: APP_CONSTANTS.LOCATION.DEFAULT_INTERVAL, // Default interval in seconds
    isNotificationEnabled: true,
    isTrackerEnabled: true,
    continueOnTerminateEnabled: false,
    notificationRepeatIntervalInMinutes: APP_CONSTANTS.LOCATION.DEFAULT_NOTIFICATION_INTERVAL, // Default notification repeat inteval in minutes
};

