//react imports
import 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { useColorScheme, StatusBar, StyleSheet, ActivityIndicator } from 'react-native';

import SplashScreen from 'react-native-splash-screen';

//redux imports
import { SettingsProvider } from '../src/contexts/SettingsContext';
import { Provider, useDispatch } from 'react-redux';
import { persistor, store } from '../src/stores/store';

//screens imports
import SettingScreen from '../src/screens/SettingsScreen';
import UserLocationListScreen from '../src/screens/UserLocationListScreen';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_CONSTANTS } from '../src/config/constants';
import { PersistGate } from 'redux-persist/integration/react';
import { logCurrentStorage } from '../src/utils/Utils';

// Create a Drawer Navigator
const Drawer = createDrawerNavigator();

function App() {

  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {

    logCurrentStorage()
    SplashScreen.hide();

  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={<ActivityIndicator size="large" />} persistor={persistor}>
        <SettingsProvider>
          <SafeAreaView style={styles.container}>
            <NavigationContainer>
              <StatusBar barStyle={isDarkMode ? "dark-content" : "light-content"} />
              <Drawer.Navigator initialRouteName={APP_CONSTANTS.SCREENS.HOME}>
                <Drawer.Screen name={APP_CONSTANTS.SCREENS.HOME} component={UserLocationListScreen} />
                <Drawer.Screen name={APP_CONSTANTS.SCREENS.SETTINGS} component={SettingScreen} />
              </Drawer.Navigator>
            </NavigationContainer>
          </SafeAreaView>
        </SettingsProvider>
      </PersistGate>
    </Provider>
  );
}


export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});