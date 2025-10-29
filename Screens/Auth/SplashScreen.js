import React from 'react';
import PortraitLayout from '../../Components/Splash/PortraitLayout';
import LandscapeLayout from '../../Components/Splash/LandscapeLayout';
import { useSelector } from 'react-redux';
const SplashScreen = props => {
  const { isTablet } = useSelector(state => state.auth);

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
