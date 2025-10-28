import React, { useEffect } from 'react';
import MainNavigator from './Nvigation/MianNavigator';
import { initDB } from './DB/Database';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { Dimensions } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import AuthReducer from './Store/Reducers/AuthReducer';
import DeviceInfo from 'react-native-device-info';
import { SetIsTabletLanscape } from './Store/Actions/AuthReducer';
const App = () => {
  const rootReducer = combineReducers({
    auth: AuthReducer,
  });

  const Store = createStore(rootReducer, applyMiddleware(ReduxThunk));

  useEffect(() => {
    const { width, height } = Dimensions.get('window');
    const aspectRatio = height / width;

    if (aspectRatio < 1.6) {
      Orientation.lockToLandscape();
    } else {
      Orientation.lockToPortrait();
    }

    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      const newAspect = window.height / window.width;
      if (newAspect < 1.6) {
        Orientation.lockToLandscape();
      } else {
        Orientation.lockToPortrait();
      }
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    Store.dispatch(SetIsTabletLanscape(DeviceInfo.isTablet()));
    SystemNavigationBar.navigationHide();
    initDB();
  }, []);

  return (
    <Provider store={Store}>
      <MainNavigator />
    </Provider>
  );
};

export default App;
