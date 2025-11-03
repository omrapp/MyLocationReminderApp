import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { defaultSettingData, SettingData } from '../data/SettingData';
import { getDataFromLocalStorage, saveDataToLocalStorage } from '../utils/Utils';

const STORAGE_KEY = '@settings_v4';

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
            const data = await getDataFromLocalStorage(STORAGE_KEY) ?? defaultSettingData;
            console.log("Get Setting Data:" + JSON.stringify(data))
            setSettingsData(data);

        };

        console.log("Loading Settings Screen");
        loadSettings();

    }, []);

    useEffect(() => {

        console.log("Settings Data Changed:" + JSON.stringify(settingsData))
        saveDataToLocalStorage(STORAGE_KEY, settingsData)

    }, [settingsData]);

    return (
        <SettingsContext.Provider value={{ settingsData, setSettingsData }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);
