import {
  IsTabletActionConst,
  UserLoginActionConst,
  UserAuthDataToReduxActionConst,
} from '../Constants/AuthConstant';
import ApiConstants from '../../Constants/ApiConstants';
import { saveAuthData, clearAuthData } from '../../DB/AuthDatabse';

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
      `${ApiConstants.BaseUrl}/authentication/oauth2/token?client_id=${ApiConstants.Client_id}&client_secret=${ApiConstants.Client_secret}&username=${info.email}&password=${info.password}&password_type=request-body&grant_type=password&login_type=${Type}&db=${ApiConstants.DatabaseName}`,

      requestOptions,
    )
      .then(response => response.json())
      .then(async result => {
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
