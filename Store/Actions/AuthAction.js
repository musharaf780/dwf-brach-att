import {
  IsTabletActionConst,
  UserLoginActionConst,
  UserAuthDataToReduxActionConst,
  GetEmployeeInformationActionConst,
} from '../Constants/AuthConstant';
import ApiConstants from '../../Constants/ApiConstants';
import { saveAuthData, clearAuthData } from '../../DB/AuthDatabse';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const SetIsTabletLanscape = bool => {
  return async dispatch => {
    dispatch({
      type: IsTabletActionConst.IS_TABLET_HAVE,
      data: bool,
    });
  };
};

export const UserAuthDataToReduxAction = data => {
  return async dispatch => {
    dispatch({
      type: UserAuthDataToReduxActionConst.SAVE_USERDATA_TO_REDUX,
      data: data,
    });
  };
};

export const UserLogoutAction = () => {
  return async dispatch => {
    try {
      dispatch({ type: UserLoginActionConst.USER_LOGOUT });
      await clearAuthData();
      console.log('User logged out successfully');
    } catch (error) {
      console.log('Logout error:', error.message);
    }
  };
};

export const UserLoginAction = info => {
  let emailValidate = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');

  const EmailOdId = info.email?.toLowerCase()?.replace(/\s/g, '');
  const Type = EmailOdId.match(emailValidate) ? 'user' : 'iqama';

  return async dispatch => {
    dispatch({ type: UserLoginActionConst.USER_LOGIN_REQ });
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(
      `${ApiConstants.BaseUrl}/authentication/oauth2/token?client_id=${
        ApiConstants.Client_id
      }&client_secret=${ApiConstants.Client_secret}&${
        Type === 'user'
          ? `username=${info.email?.trim()}`
          : `iqama_no=${info.email}`
      }&password=${
        info.password
      }&password_type=request-body&grant_type=password&login_type=${
        Type === 'user' ? 'user' : 'iqama'
      }&db=${ApiConstants.DatabaseName}`,

      requestOptions,
    )
      .then(response => response.json())
      .then(async result => {
        console.log(JSON.stringify(result));
        if (result.access_token) {
          await saveAuthData(result);
          dispatch({
            type: UserLoginActionConst.USER_LOGIN_SUCC,
            data: result,
          });
        } else {
          dispatch({
            type: UserLoginActionConst.USER_LOGIN_FAIL,
            data: result,
          });
        }
      })
      .catch(error => console.log('error', error));
  };
};

export const GetEmployeeInformationAction = token => {
  return async dispatch => {
    try {
      const myHeaders = new Headers();
      myHeaders.append('Authorization', `Bearer ${token}`);

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      fetch(
        `${ApiConstants.BaseUrl}/user/quick_info?db=${ApiConstants.DatabaseName}`,
        requestOptions,
      )
        .then(response => response.json())
        .then(async result => {
          console.log(JSON.stringify(result));
          await saveDataIntoStorage(result);
          dispatch({
            type: GetEmployeeInformationActionConst.USER_PROFILE_INFORMATION,
            data: result,
          });
        })
        .catch(error => console.error(error));
    } catch (error) {
      console.log('Logout error:', error.message);
    }
  };
};

export const GetUserInformationFromLocal = () => {
  return async dispatch => {
    try {
      const data = await getDataFromStorage();
      if (data) {
        dispatch({
          type: GetEmployeeInformationActionConst.USER_PROFILE_INFORMATION,
          data,
        });
      }
    } catch (error) {
      console.log('Logout error:', error.message);
    }
  };
};

export const getDataFromStorage = async () => {
  try {
    const value = await AsyncStorage.getItem('userInfo');
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.log('Error retrieving user info:', error);
    return null;
  }
};

const saveDataIntoStorage = async userInfo => {
  await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
};
