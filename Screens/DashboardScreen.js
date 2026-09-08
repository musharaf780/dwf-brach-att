import DashboardLandcape from '../Components/Dashboard/DashboardLandcape';
import DashboardPortrait from '../Components/Dashboard/DashboardPortrait';
import { useSelector } from 'react-redux';
import * as AuthAction from '../Store/Actions/AuthAction';
import { View, Text, Button } from 'react-native';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import ApiConstants from '../Constants/ApiConstants';

const SplashScreen = props => {
  const { isTablet, loginSuccess } = useSelector(state => state.auth);
  const dispatch = useDispatch();


  const CheckTokenValidation = () => {

    try {
      const myHeaders = new Headers();
      myHeaders.append('Authorization', `Bearer ${loginSuccess.access_token}`);

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      fetch(
        `${ApiConstants.BaseUrl}/employee/hit_token`,
        requestOptions,
      )
        .then(async response => {
          const result = await response.json().catch(() => null);
          if (response.status !== 200) {
            dispatch(AuthAction.UserLogoutAction(loginSuccess?.user_id, loginSuccess?.access_token));
            props.navigation.replace('LoginScreen');
          }
          console.log(response.status, JSON.stringify(result), "I AMERE")
        })
        .catch(error => console.error(error));
    } catch (error) {
      console.log('Logout error:', error.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      CheckTokenValidation();
    }, [loginSuccess?.access_token]),
  );


  return isTablet ? (
    <DashboardLandcape
      onPendingPress={() => props.navigation.navigate('PendingShift')}
      logoutPress={() => {
        dispatch(AuthAction.UserLogoutAction(loginSuccess?.user_id, loginSuccess?.access_token));
        props.navigation.replace('LoginScreen');
      }}
      onNavigate={() => {
        props.navigation.replace('LoginScreen');
      }}
    />
  ) : (
    <DashboardPortrait
      onPendingPress={() => props.navigation.navigate('PendingShift')}
      logoutPress={() => {
        dispatch(AuthAction.UserLogoutAction(loginSuccess?.user_id, loginSuccess?.access_token));
        props.navigation.replace('LoginScreen');
      }}
      onNavigate={() => {
        props.navigation.replace('LoginScreen');
      }}
    />
  );
};

export default SplashScreen;
