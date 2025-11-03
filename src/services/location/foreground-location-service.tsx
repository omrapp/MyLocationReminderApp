import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

let foregroundWatchId: number | null = null;


export const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
        const status = await Geolocation.requestAuthorization('always'); // Or 'always' for background
        return status === 'granted';
    } else if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Location Permission',
                message: 'This app needs access to your location.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return false;
};


export const startForegroundLocationService = () => {

    console.log('Starting foreground location service...');
    foregroundWatchId = Geolocation.watchPosition(
        (position) => {
            //setLocation(position.coords);
            console.log('Forground [location] -', position.coords);
        },
        (error) => {
            console.log(error);
        },
        { enableHighAccuracy: true, interval: 10000, fastestInterval: 5000, distanceFilter: 10 }
    );

    // return () => {
    //     Geolocation.clearWatch(watchId);
    // };

};

export const stopForegroundLocationService = () => {
    console.log('Stopping foreground location service...');
    if (foregroundWatchId !== null) {
        Geolocation.clearWatch(foregroundWatchId);
        foregroundWatchId = null;
    }
};
