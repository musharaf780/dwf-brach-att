import React, { useEffect } from 'react';
import PortraitLayout from '../../Components/Splash/PortraitLayout';
import LandscapeLayout from '../../Components/Splash/LandscapeLayout';
import { useSelector, useDispatch } from 'react-redux';
import { getAuthData } from '../../DB/AuthDatabse';
import * as AuthAction from '../../Store /Actions/AuthAction';
const SplashScreen = props => {
  const { isTablet, loginSuccess } = useSelector(state => state.auth);

  const dispatch = useDispatch();

  const GetUserData = async () => {
    const data = await getAuthData();
    dispatch(AuthAction.UserAuthDataToReduxAction(data));
  };

  useEffect(() => {
    GetUserData();
  }, []);

  return isTablet ? (
    <LandscapeLayout
      onNavigate={() => {
        if (loginSuccess) {
          props.navigation.replace('DashboardScreen');
        } else {
          props.navigation.replace('LoginScreen');
        }
      }}
    />
  ) : (
    <PortraitLayout
      onNavigate={() => {
        if (loginSuccess) {
          props.navigation.replace('DashboardScreen');
        } else {
          props.navigation.replace('LoginScreen');
        }
      }}
    />
  );
};

export default SplashScreen;
