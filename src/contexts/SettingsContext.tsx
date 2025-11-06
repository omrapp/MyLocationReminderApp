import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { getDataFromLocalStorage, saveDataToLocalStorage } from '../utils/Utils';
import { APP_CONSTANTS } from '../config/constants';
import { defaultSettingData, SettingData } from '../types/SettingData';


interface ISettingsContext {
    settingsData: SettingData;
    setSettingsData: React.Dispatch<React.SetStateAction<SettingData>>;
}

const defaultSettingsContext: ISettingsContext = {
    settingsData: defaultSettingData,
    setSettingsData: () => { },
};


const SettingsContext = createContext<ISettingsContext>(defaultSettingsContext);


export const SettingsProvider = ({ children }) => {

    const [settingsData, setSettingsData] = useState<SettingData>(defaultSettingData);

    useLayoutEffect(() => {

        const loadSettings = async () => {
            const data = await getDataFromLocalStorage(APP_CONSTANTS.STORAGE_KEYS.SETTINGS) ?? defaultSettingData;
            console.log("Get Setting Data:" + JSON.stringify(data))
            setSettingsData(data);

        };

        console.log("Loading Settings Screen");
        loadSettings();

    }, []);

    useEffect(() => {

        console.log("Settings Data Changed:" + JSON.stringify(settingsData))
        saveDataToLocalStorage(APP_CONSTANTS.STORAGE_KEYS.SETTINGS, settingsData)

    }, [settingsData]);

    return (
        <SettingsContext.Provider value={{ settingsData, setSettingsData }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);
