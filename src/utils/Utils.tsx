import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Linking, Platform } from 'react-native';
import { LocationItem } from '../types/LocationItem';

const MIN = 60

// Saving data
export const saveDataToLocalStorage = async (key: string, value) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error saving setting:', error);
    }
};

// Retrieving data
export const getDataFromLocalStorage = async (key: string): Promise<any | null> => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value != null ? JSON.parse(value) : null;
    } catch (error) {
        console.error('Error retrieving setting:', error);
        return null;
    }
};


export const removeDataFromLocalStorage = async (key: string) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing setting:', error);
    }
};

export const clearAllDataFromLocalStorage = async () => {
    try {
        await AsyncStorage.clear();
    }
    catch (error) {
        console.error('Error clearing storage:', error);
    }
};

export const openMapWithCoordinates = async (latitude: number, longitude: number, label = 'Location') => {

    const scheme = Platform.select({
        ios: 'maps:0,0?q=',
        android: 'https://www.google.com/maps/search/?api=1&query=',
    });

    const url = Platform.select({
        ios: `${scheme}${label}@${latitude},${longitude}`,
        android: `${scheme}${latitude},${longitude}`,
    });

    try {

        await Linking.openURL(url).catch(err => {
            console.error('Failed to open Google Maps:', err);
            Alert.alert('Error', 'Could not open Google Maps. Please ensure you have the app installed.');
        });;

    } catch (error) {
        console.error('An error occurred', error);
    }
};

export const isUserStationary = (list: LocationItem[], mins: number, seconds: number) => {

    const range = Math.floor((mins * MIN) / seconds);
    const currentLocationsData = list;
    const startIndex = currentLocationsData.length - range
    const endIndex = currentLocationsData.length - 1

    console.log("Locations list length: " + currentLocationsData.length + ", startIndex: " + startIndex + ", endIndex: " + endIndex)

    if (!currentLocationsData || currentLocationsData.length === 0 || startIndex < 0 || endIndex > currentLocationsData.length || startIndex >= endIndex) {
        return false;
    }

    const subArray = currentLocationsData.slice(startIndex, endIndex);

    return areLatestRangeIndicesEqual(subArray)
};

const areLatestRangeIndicesEqual = (list: LocationItem[]) => {

    const latitudes = list.map((item: LocationItem) => parseFloat(item.latitude.toFixed(4)));
    const longitudes = list.map((item: LocationItem) => parseFloat(item.longitude.toFixed(4)));

    const lastLatitude = latitudes[latitudes.length - 1];
    const lastLongitude = longitudes[longitudes.length - 1];

    console.log('latitudes: ' + JSON.stringify(latitudes))
    console.log('longitudes: ' + JSON.stringify(longitudes))

    console.log('lastLatitude: ' + lastLatitude)
    console.log('lastLongitude: ' + lastLongitude)

    const isEqual = latitudes.every(item => item === lastLatitude) && longitudes.every(item => item === lastLongitude);

    console.log('is all lacations equal ' + isEqual)

    return isEqual;
}

export function logCurrentStorage() {
    AsyncStorage.getAllKeys().then((keyArray) => {
        AsyncStorage.multiGet(keyArray).then((keyValArray) => {
            let myStorage: any = {};
            for (let keyVal of keyValArray) {
                myStorage[keyVal[0]] = keyVal[1]
            }

            console.log('CURRENT STORAGE: ', myStorage);
        })
    });
}






// export const getSettingsData = async (): Promise<SettingData | null> => {
//     try {
//         const jsonValue = await AsyncStorage.getItem('@settings');
//         return jsonValue != null ? (JSON.parse(jsonValue) as SettingData) : null;
//     } catch (e) {
//         // Handle errors here (e.g., log the error)
//         console.error('Error retrieving user data:', e);
//         return null;
//     }
// };

// export const saveSettingsData = async (key: string, settings: SettingData) => {
//     try {
//         await AsyncStorage.setItem(key, JSON.stringify(settings));
//     } catch (e) {
//         // Handle errors here (e.g., log the error)
//         console.error('Error saving setting:', e);
//         return null;
//     }
// };