import { StyleSheet, Text, TextInput, View, Switch } from 'react-native';
import { useSettings } from '../contexts/SettingsContext';
import { useState } from 'react';


const SettingScreen = () => {

    const { settingsData, setSettingsData } = useSettings();

    const [intervalInSeconds, setIntervalInSeconds] = useState(settingsData.intervalInSeconds);
    const [notificationRepeatIntervalInMinutes, setNotificationRepeatIntervalInMinutes] = useState(settingsData.notificationRepeatIntervalInMinutes);

    const handleIntervalInputChange = (text: string) => {
        console.log('Interval ' + text);
        setIntervalInSeconds(Number(text));
    };

    const handleNotificationTimeInputChange = (text: string) => {
        console.log('Notification ' + text);
        setNotificationRepeatIntervalInMinutes(Number(text));

    };

    const toggleNotificationSwitch = () => {
        // Logic to handle switch toggle
        console.log('Notification switch toggled to ' + !settingsData.isNotificationEnabled);
        setSettingsData(prevInfo => ({ ...prevInfo, isNotificationEnabled: !prevInfo.isNotificationEnabled }));
        // handleNotificationChange(!settingsData.isNotificationEnabled, settingsData.notificationRepeatIntervalInMinutes);
    };

    const toggleTrickerSwitch = () => {
        // Logic to handle switch toggle
        console.log('Tracker switch toggled to ' + !settingsData.isTrackerEnabled);
        setSettingsData(prevInfo => ({ ...prevInfo, isTrackerEnabled: !prevInfo.isTrackerEnabled }));
    };

    const toggleContinueOnTerminateSwitch = () => {
        // Logic to handle switch toggle
        console.log('App terminated Tracker switch toggled to ' + !settingsData.continueOnTerminateEnabled);
        setSettingsData(prevInfo => ({ ...prevInfo, continueOnTerminateEnabled: !prevInfo.continueOnTerminateEnabled }));
    };


    const handleIntervalInputEndEditing = () => {
        if (isNaN(Number(intervalInSeconds)) || intervalInSeconds * 2 > settingsData.notificationRepeatIntervalInMinutes * 60) {
            return;
        }
        setSettingsData(prevInfo => ({ ...prevInfo, intervalInSeconds: intervalInSeconds }));
    };

    const handleNotificationInputEndEditing = () => {
        if (isNaN(Number(intervalInSeconds)) || (notificationRepeatIntervalInMinutes * 60) / 2 < settingsData.intervalInSeconds) {
            return;
        }
        setSettingsData(prevInfo => ({ ...prevInfo, notificationRepeatIntervalInMinutes: notificationRepeatIntervalInMinutes }));
    };


    return (

        <View style={styles.container}>

            <View style={styles.row}>
                <Text style={styles.labelText}>Interval (sec):</Text>
                <TextInput
                    style={styles.input}
                    value={String(intervalInSeconds)}
                    onChangeText={handleIntervalInputChange}
                    onEndEditing={handleIntervalInputEndEditing}
                    placeholder="Enter the track interval in seconds"
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.row}>
                <Text style={styles.labelText}>Notification (mins):</Text>
                <TextInput
                    style={styles.input}
                    value={String(notificationRepeatIntervalInMinutes)}
                    onChangeText={handleNotificationTimeInputChange}
                    onEndEditing={handleNotificationInputEndEditing}
                    placeholder="Enter the notification repeat interval in mintues"
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.row}>
                <Text style={styles.labelText}>Notification:</Text>
                <Switch
                    onValueChange={toggleNotificationSwitch}
                    value={settingsData.isNotificationEnabled}
                />
            </View>

            <View style={styles.row}>
                <Text style={styles.labelText}>Tracker:</Text>
                <Switch
                    onValueChange={toggleTrickerSwitch}
                    value={settingsData.isTrackerEnabled}
                />
            </View>

            <View style={styles.row}>
                <Text style={styles.labelText}>Continue Tracker (App terminated):</Text>
                <Switch
                    onValueChange={toggleContinueOnTerminateSwitch}
                    value={settingsData.continueOnTerminateEnabled}
                />
            </View>


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        padding: 16,
    },

    row: {
        flexDirection: 'row', // Arranges children horizontally
        justifyContent: 'space-between', // Distributes space between items',
        alignItems: 'center', // Aligns items vertically in the center
        padding: 10,
        margin: 10,
    },
    labelText: {
        marginRight: 16, // Adds space between the Text and TextInput
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 4,
        marginRight: 10,
    },

});


export default SettingScreen;