import React, { useEffect } from 'react';

import LoginScreenLanscape from '../../Components/Auth/LoginScreenLanscape';
import LoginScreenPortrail from '../../Components/Auth/LoginScreenPortrail';
import { useSelector } from 'react-redux';
import { Alert, Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { showGlobalToast } from '../../Components/ToastManager';
import { ShowToast } from '../../Components/ShowToast';
const LoginScreen = props => {
  const { isTablet } = useSelector(state => state.auth);

  const askCameraPermission = async () => {
    let permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;

    const status = await check(permission);

    if (status === RESULTS.GRANTED) {
      console.log('Camera permission already granted');
    } else {
      const result = await request(permission);
      if (result === RESULTS.GRANTED) {
        // showGlobalToast('Camera permission granted!', 'success');
        ShowToast(
          'success',
          'Camera',
          'Camera permission granted successfully',
        );
      } else {
        showGlobalToast('Camera permission not granted!', 'error');
        ShowToast(
          'error',
          'Camera',
          'Camera permission not granted successfully',
        );
      }
    }
  };

  const CheckCameraPermission = async () => {
    let permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;
    const status = await check(permission);
    if (status === RESULTS.GRANTED) {
      ShowToast('success', 'Camera', 'Camera permission already granted');
    } else {
      ShowToast('error', 'Camera', 'Camera permission not granted!');
    }
  };

  useEffect(() => {
    CheckCameraPermission();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      askCameraPermission();
    }, 1500);
  }, []);

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
