
export interface SettingData {
    intervalInSeconds: number;
    isNotificationEnabled: boolean;
    isTrackerEnabled: boolean;
    continueOnTerminateEnabled: boolean;
    notificationRepeatIntervalInMinutes: number;

}

export const defaultSettingData: SettingData = {
    intervalInSeconds: 8, // Default interval in seconds
    isNotificationEnabled: true,
    isTrackerEnabled: true,
    continueOnTerminateEnabled: false,
    notificationRepeatIntervalInMinutes: 10, // Default notification repeat inteval in minutes
};

