import React, { useEffect, useState } from 'react';
import PortraitLayout from '../../Components/Splash/PortraitLayout';
import LandscapeLayout from '../../Components/Splash/LandscapeLayout';
import { useSelector, useDispatch } from 'react-redux';
import { getAuthData } from '../../DB/AuthDatabse';
import * as AuthAction from '../../Store/Actions/AuthAction';
import checkVersion from 'react-native-store-version';
import DeviceInfo from 'react-native-device-info';
import UpdateAppMopup from '../../Components/UpdateAppMopup';
import UpdateAppPopUpLand from '../../Components/UpdateAppPopUpLand';
import ApiConstants from '../../Constants/ApiConstants';
import { ShowToast } from '../../Components/ShowToast';
import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
const SplashScreen = props => {
  const { isTablet, loginSuccess } = useSelector(state => state.auth);

  const [updateModal, setUpdateModal] = useState(false);
  const dispatch = useDispatch();

  const RefreshToken = async (access_token, refresh_token) => {
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${access_token}`);
    myHeaders.append('Content-Type', 'application/json');

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(
      `${ApiConstants.BaseUrl}/authentication/oauth2/token?client_id=${ApiConstants.Client_id}&client_secret=${ApiConstants.Client_secret}&refresh_token=${refresh_token}&grant_type=refresh_token&db=${ApiConstants.DatabaseName}`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        if (result.success && result?.access_token && result?.refresh_token) {
          dispatch(
            AuthAction.UpdateAuthDataAction({
              access_token: result.access_token,
              refresh_token: result.refresh_token,
            }),
          );
          ShowToast(
            'success',
            'Session refreshed',
            'Your previous session has refreshed successfully.',
          );
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  const GetUserData = async () => {
    const data = await getAuthData();
    dispatch(AuthAction.UserAuthDataToReduxAction(data));

    if (data) {
      RefreshToken(data.access_token, data.refresh_token);
    } else {
      console.log('[SplashScreen] no auth data found');
      ShowToast(
        'error',
        'No active session',
        "You don't have any active session.",
      );
    }
  };

  const CheckVersion = async () => {
    try {
      const check = await checkVersion({
        version: DeviceInfo.getVersion(),
        iosStoreURL: 'https://apps.apple.com/us/app/dwf-workforce/id6754880336',
        androidStoreURL:
          'https://play.google.com/store/apps/details?id=com.dwfbranchatt',
      });

      if (check.result === 'new') {
        setUpdateModal(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const requestNotificationPermission = async () => {
    if (Platform.OS !== 'android' || Platform.Version < 33) return;
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    console.log('Notification permission result:', granted);
    if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      Alert.alert(
        'Notification Permission',
        'Notifications are blocked. Please enable them in settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ],
      );
    }
  };

  useEffect(() => {
    GetUserData();
    CheckVersion();
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    if (!updateModal) return;

    const timer = setTimeout(() => {
      setUpdateModal(false);
    }, 20000);

    return () => clearTimeout(timer);
  }, [updateModal]);

  return isTablet ? (
    <>
      <LandscapeLayout
        onNavigate={() => {
          if (loginSuccess) {
            dispatch(AuthAction.GetUserInformationFromLocal());
            props.navigation.replace('DashboardScreen');
          } else {
            props.navigation.replace('LoginScreen');
          }
        }}
      />
      {updateModal && <UpdateAppPopUpLand />}
    </>
  ) : (
    <>
      <PortraitLayout
        onNavigate={() => {
          if (loginSuccess) {
            dispatch(AuthAction.GetUserInformationFromLocal());
            props.navigation.replace('DashboardScreen');
          } else {
            props.navigation.replace('LoginScreen');
          }
        }}
      />
      {updateModal && <UpdateAppMopup />}
    </>
  );
};

export default SplashScreen;
