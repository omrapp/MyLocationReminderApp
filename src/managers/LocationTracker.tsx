import { useEffect, useLayoutEffect, useState } from 'react';

//redux imports
import { useDispatch } from 'react-redux';
import { addLocation } from '../slices/locationSlice';
import { useSettings } from '../contexts/SettingsContext';

//location srevice imports
import { requestLocationPermission } from '../services/location/foreground-location-service';
import { startBackgroundLocationService, stopBackgroundLocationService } from '../services/location/background-location-service';

const LocationTracker = () => {

    const dispatch = useDispatch();
    const [hasPermission, setHasPermission] = useState(false);
    const { settingsData } = useSettings();

    useLayoutEffect(() => {
        const fetchPermission = async () => {
            const permission = await requestLocationPermission();
            setHasPermission(permission);
            if (!permission) {
                console.log('Location permission not granted');
                return;
            }

            console.log("Permission granted for location tracking");
        }

        fetchPermission();

    }, []);


    useEffect(() => {

        console.log("LocationTracker useEffect triggered with hasPermission:", hasPermission, "and isTrackerEnabled:", settingsData.isTrackerEnabled);

        if (hasPermission && settingsData.isTrackerEnabled) {
            console.log("Called startBackgroundLocationService from LocationTracker.tsx");
            startBackgroundLocationService(settingsData.intervalInSeconds, settingsData.continueOnTerminateEnabled, location => {
                console.log("New location received in LocationTracker:", JSON.stringify(location));
                dispatch(addLocation(location));
            });
        } else {
            console.log("Called stopBackgroundLocationService from LocationTracker.tsx");
            stopBackgroundLocationService();
        }

        return () => {
            stopBackgroundLocationService();
        }

    }, [dispatch, hasPermission, settingsData]);

    return null; // This component doesn't render anything visually
};

export default LocationTracker;