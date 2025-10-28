import React from 'react';
import { Alert, Text, View, useWindowDimensions } from 'react-native';
import PortraitLayout from '../../Components/Splash/PortraitLayout';
import LandscapeLayout from '../../Components/Splash/LandscapeLayout';
import { useSelector } from 'react-redux';
const SplashScreen = props => {
  const { isTablet } = useSelector(state => state.auth);
  const { width, height } = useWindowDimensions();
  const isPortrait = width < height;

  return isTablet ? (
    <LandscapeLayout
      onNavigate={() => {
        props.navigation.replace('LoginScreen');
      }}
    />
  ) : (
    <PortraitLayout
      onNavigate={() => {
        props.navigation.replace('LoginScreen');
      }}
    />
  );
};

export default SplashScreen;
