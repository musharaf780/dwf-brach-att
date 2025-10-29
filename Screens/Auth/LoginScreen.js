import React from 'react';

import LoginScreenLanscape from '../../Components/Auth/LoginScreenLanscape';
import LoginScreenPortrail from '../../Components/Auth/LoginScreenPortrail';
import { useSelector } from 'react-redux';
const LoginScreen = props => {
  const { isTablet } = useSelector(state => state.auth);

  return isTablet ? (
    <LoginScreenLanscape
      navigate={() => props.navigation.replace('DashboardScreen')}
    />
  ) : (
    <LoginScreenPortrail
      navigate={() => props.navigation.replace('DashboardScreen')}
    />
  );
};

export default LoginScreen;
