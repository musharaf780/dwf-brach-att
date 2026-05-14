// App.js
import React, { useEffect } from 'react';

import MainNavigator from './Nvigation/MianNavigator';
import { initDB } from './DB/Database';
import { initAuthDB } from './DB/AuthDatabse';
import { initEmployeeDB } from './DB/EmployeeList';
import { initEmployeePendingShiftDB } from './DB/EmployeePendingShift';
import { initializeEmployeePushedShiftTable } from './DB/EmployeePushedShifts';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import Toast from 'react-native-toast-message';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import AuthReducer from './Store/Reducers/AuthReducer';
import EmployeeDataReducer from './Store/Reducers/EmployeeDataReducer';
import { toastConfig } from './utils/toastConfig';
import DeviceInfo from 'react-native-device-info';
import { SetIsTabletLanscape } from './Store/Actions/AuthAction';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { Alert, Platform } from 'react-native';

const App = () => {
  const rootReducer = combineReducers({
    auth: AuthReducer,
    employee: EmployeeDataReducer,
  });

  const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

  useEffect(() => {
    const init = async () => {
      const isTablet = await DeviceInfo.isTablet();
      store.dispatch(SetIsTabletLanscape(isTablet));
      SystemNavigationBar.navigationHide();
      initDB();
      initAuthDB();
      initEmployeeDB();
      initEmployeePendingShiftDB();
      initializeEmployeePushedShiftTable();
    };
    init();
  }, []);


  const notificationListeners = () => {
    messaging().onMessage(async remoteMessage => {
      console.log('Foreground notification:', remoteMessage);
      if (Platform.OS === 'android') {
        await notifee.displayNotification({
          title: remoteMessage.notification?.title || 'Notification',
          body: remoteMessage.notification?.body || '',
          android: {
            channelId: 'default',
            importance: AndroidImportance.HIGH,
            smallIcon: 'ic_notification',
          },
        });
      } else {
        Alert.alert(
          remoteMessage.notification?.title || 'Notification',
          remoteMessage.notification?.body || '',
        );
      }
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Background notification opened:', remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Quit state notification:', remoteMessage);
        }
      });
  };


  const getFCMToken = async () => {
    try {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
    } catch (error) {
      console.log('Error getting token:', error);
    }
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });
    }
    getFCMToken();
    notificationListeners();
  }, []);



  return (
    <Provider store={store}>
      <MainNavigator />
      <Toast />
    </Provider>
  );
};

export default App;
