import React, { useEffect } from 'react';
import MainNavigator from './Nvigation/MianNavigator';
import { initDB } from './DB/Database';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { Dimensions } from 'react-native';
import Orientation from 'react-native-orientation-locker';

const App = () => {
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
    SystemNavigationBar.navigationHide();
    initDB();
  }, []);

  return <MainNavigator />;
};

export default App;
