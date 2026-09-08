/**
 * @format
 */

import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
// Workaround: react-native-screens' native RNSScreen Fabric component crashes on
// launch under the New Architecture with RN 0.80 (RNSScreenComponentDescriptor
// adopt assertion). Disabling native screens makes @react-navigation/stack fall
// back to plain views, which is stable here.
enableScreens(false);

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
