//react imports
import 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { useColorScheme, StatusBar, StyleSheet } from 'react-native';

import SplashScreen from 'react-native-splash-screen';

//redux imports
import { SettingsProvider } from '../src/contexts/SettingsContext';
import { Provider } from 'react-redux';
import { store } from '../src/stores/store';

//screens imports
import SettingScreen from '../src/screens/SettingsScreen';
import UserLocationListScreen from '../src/screens/UserLocationListScreen';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_CONSTANTS } from '../src/config/constants';

// Create a Drawer Navigator
const Drawer = createDrawerNavigator();

function App() {

  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {

    SplashScreen.hide();

  }, []);


  return (
    <Provider store={store}>
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
    </Provider>
  );
}


export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});