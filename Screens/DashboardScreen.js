import DashboardLandcape from '../Components/Dashboard/DashboardLandcape';
import DashboardPortrait from '../Components/Dashboard/DashboardPortrait';
import { useSelector } from 'react-redux';
import * as AuthAction from '../Store/Actions/AuthAction';
import { View, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import ApiConstants from '../Constants/ApiConstants';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native'

const SplashScreen = props => {
  const { isTablet, loginSuccess } = useSelector(state => state.auth);
  const dispatch = useDispatch();







  const RegisterDevice = async () => {
    const token = await messaging().getToken();
    const PlatformName = Platform.OS === 'ios' ? 'iOS' : 'Android';
    const VersionName = DeviceInfo?.getVersion().toString();
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append(
      'Authorization',
      `Bearer ${loginSuccess?.access_token}`,
    );

    var raw = JSON.stringify({
      device_os: PlatformName,
      device_id: token,
      app_version: VersionName,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(
      `${ApiConstants.BaseUrl}/firebase/user/${loginSuccess?.user_id}/add_wf_device?db=${ApiConstants.DatabaseName}`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        console.log(JSON.stringify(result), "DEIVESSSSSS-===");
      })
      .catch(error => console.log('error', error));
  };


  const DeactivateAllDevices = async () => {
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append(
      'Authorization',
      `Bearer ${loginSuccess?.access_token}`,
    );

    var raw = JSON.stringify({
      device_os: PlatformName,
      device_id: token,
      app_version: VersionName,
    });

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(
      `${ApiConstants.BaseUrl}/firebase/user/${loginSuccess?.user_id}/deactivate_wf_extra_devices?db=${ApiConstants.DatabaseName}`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        console.log(JSON.stringify(result), "DeactivateAllDevices");
      })
      .catch(error => console.log('error', error));
  };

  useEffect(() => {
    RegisterDevice()
  }, [])

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
