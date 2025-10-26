import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import PortraitLayout from '../../Components/Splash/PortraitLayout';
import LandscapeLayout from '../../Components/Splash/LandscapeLayout';
const SplashScreen = props => {
  const { width, height } = useWindowDimensions();
  const isPortrait = width < height;

  return isPortrait ? (
    <PortraitLayout    onNavigate={() => {
        props.navigation.replace('LoginScreen');
      }} />
  ) : (
    <LandscapeLayout
      onNavigate={() => {
        props.navigation.replace('LoginScreen');
      }}
    />
  );
};

export default SplashScreen;
