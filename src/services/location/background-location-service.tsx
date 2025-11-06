import BackgroundGeolocation from 'react-native-background-geolocation';
import { LocationItem } from '../../types/LocationItem';

export const startBackgroundLocationService = (intervalInSeconds: number, continueOnTerminate: boolean, callback: (location: LocationItem) => void) => {

    // Configure the plugin
    BackgroundGeolocation.ready({
        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
        distanceFilter: 0, // Get updates even if distance change is small
        stopOnTerminate: !continueOnTerminate, // Continue tracking when app is terminated
        startOnBoot: true, // Start tracking on device boot
        debug: true, // Enable debug logging
        locationUpdateInterval: intervalInSeconds * 1000, // Location update interval in milliseconds (10 seconds)
        logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
        foregroundService: true,

    }, (state) => {
        if (!state.enabled) {
            // Start tracking if not already enabled
            console.log('Starting background location service...');
            BackgroundGeolocation.start();
        }
    });

    BackgroundGeolocation.onLocation((location) => {
        const locationItem: LocationItem = {
            id: Date.now().toString(),
            timestamp: new Date(location.timestamp).toLocaleString(),
            location: `Lat: ${location.coords.latitude}, Lon: ${location.coords.longitude}`,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        };
        callback(locationItem);
    }, (error) => {
        console.warn('Location error:', error);
    });

    BackgroundGeolocation.onMotionChange(onMotionChange)

};

const onMotionChange = (event) => {
    console.log('[motionchange] -', event.isMoving, event.location);
    if (event.isMoving) {
        // User is moving
        console.log('User is now moving!');
    } else {
        // User is stationary
        console.log('User is now stationary.');
    }
}

export const isGpsEnable = () => {
    BackgroundGeolocation.onProviderChange((event) => {
        console.log('[providerchange] -', event.enabled, event.status);

        if (!event.enabled) {
            // GPS is disabled or location services are not available
            console.warn('Location services disabled or unavailable!');
            // You can prompt the user to enable GPS here
            // BackgroundGeolocation.showLocationSettings(); // This will open location settings
            return false;
        } else {
            // GPS is enabled
            console.log('Location services are enabled.');
            return true;
        }
    });
}



// export const onLocationUpdate = (callback: (location: LocationItem) => void) => {
//     BackgroundGeolocation.onLocation((location) => {
//         const locationItem: LocationItem = {
//             id: Date.now().toString(),
//             timestamp: new Date(location.timestamp).toLocaleString(),
//             location: `Lat: ${location.coords.latitude}, Lon: ${location.coords.longitude}`,
//             latitude: location.coords.latitude,
//             longitude: location.coords.longitude,
//         };
//         callback(locationItem);
//     }, (error) => {
//         console.warn('Location error:', error);
//     });
// };

export const stopBackgroundLocationService = () => {
    BackgroundGeolocation.getState(state => {
        console.log("[getState] enabled? ", state.enabled);
        if (state.enabled) {
            console.log('Stopping background location service...');
            BackgroundGeolocation.stop();
            BackgroundGeolocation.removeListeners();
        } else {
            // Background geolocation is disabled
        }
    });

};



