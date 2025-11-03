import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

const useAppStateListener = () => {

    const appState = useRef(AppState.currentState);
    const [appStateStatus, setAppStateStatus] = useState(appState.current);

    useEffect(() => {
        const handler = AppState.addEventListener('change', async nextAppState => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                console.log('App has come to the foreground!');
                // setAppStateVisible(nextAppState);
            }
            else if (
                appState.current === 'background'
            ) {
                console.log('App has gone to the background!');

                // setAppStateVisible(nextAppState);
            }

            appState.current = nextAppState;
            setAppStateStatus(appState.current);

        });

        return () => handler.remove();
    }, []);

    return appStateStatus
};

export default useAppStateListener;