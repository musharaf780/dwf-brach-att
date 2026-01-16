import React, { useEffect, useState } from 'react';
import PortraitLayout from '../../Components/Splash/PortraitLayout';
import LandscapeLayout from '../../Components/Splash/LandscapeLayout';
import { useSelector, useDispatch } from 'react-redux';
import { getAuthData } from '../../DB/AuthDatabse';
import * as AuthAction from '../../Store/Actions/AuthAction';
import checkVersion from 'react-native-store-version';
import DeviceInfo from 'react-native-device-info';
import UpdateAppMopup from '../../Components/UpdateAppMopup';
const SplashScreen = props => {
  const { isTablet, loginSuccess } = useSelector(state => state.auth);

  const [updateModal, setUpdateModal] = useState(false);
  const dispatch = useDispatch();

  const GetUserData = async () => {
    const data = await getAuthData();
    dispatch(AuthAction.UserAuthDataToReduxAction(data));
  };

  const CheckVersion = async () => {
    try {
      const check = await checkVersion({
        version: DeviceInfo.getVersion(), // app local version
        iosStoreURL: 'https://apps.apple.com/us/app/dwf-workforce/id6754880336',
        androidStoreURL:
          'https://play.google.com/store/apps/details?id=com.dwfbranchatt',
      });

      if (check.result === 'new') {
        // setUpdateModal(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    GetUserData();
    CheckVersion();
  }, []);

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
      {updateModal && <UpdateAppMopup />}
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
