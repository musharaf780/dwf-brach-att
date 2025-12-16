import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from '../Screens/Auth/SplashScreen';
import { ThemeColors } from '../Constants/Color';
import LoginScreen from '../Screens/Auth/LoginScreen';
import DashboardScreen from '../Screens/DashboardScreen';
import PendingShift from '../Screens/PendingShift';
const Stack = createStackNavigator();
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: ThemeColors.primary,
  },
};

const MainNavigator = () => {
  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
        <Stack.Screen name="PendingShift" component={PendingShift} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
