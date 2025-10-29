import {
  IsTabletActionConst,
  UserLoginActionConst,
} from '../Constants/AuthConstant';
import ApiConstants from '../../Constants/ApiConstants';
import { saveAuthData } from '../../DB/AuthDatabse';

export const SetIsTabletLanscape = bool => {
  return async dispatch => {
    dispatch({
      type: IsTabletActionConst.IS_TABLET_HAVE,
      data: bool,
    });
  };
};

// export const UserLoginAction = info => {
//   return async dispatch => {
//     dispatch({ type: UserLoginActionConst.USER_LOGIN_REQ });
//     try {
//       const url = `${ApiConstants.BaseUrl}/authentication/oauth2/token?client_id=${ApiConstants.Client_id}&client_secret=${ApiConstants.Client_secret}&username=${info.email}&password=${info.password}&password_type=request-body&grant_type=password&login_type=user&db=${ApiConstants.DatabaseName}`;

//       const response = await fetch(url, { method: 'GET', redirect: 'follow' });
//       const result = await response.json();
//       console.log(JSON.stringify(result));
//       if (result?.access_token) {
// await saveAuthData(result);
// dispatch({ type: UserLoginActionConst.USER_LOGIN_SUCC, data: result });
//       } else {
//         dispatch({ type: UserLoginActionConst.USER_LOGIN_FAIL });
//       }
//     } catch (error) {
//       dispatch({ type: UserLoginActionConst.USER_LOGIN_FAIL });
//       console.log('Login error:', error);
//     }
//   };
// };

export const UserLoginAction = info => {
  return async dispatch => {
    dispatch({ type: UserLoginActionConst.USER_LOGIN_REQ });
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(
      `${ApiConstants.BaseUrl}/authentication/oauth2/token?client_id=${ApiConstants.Client_id}&client_secret=${ApiConstants.Client_secret}&username=sadikh@dwf.com.sa&password=1&password_type=request-body&grant_type=password&login_type=user&db=${ApiConstants.DatabaseName}`,

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
        }
      })
      .catch(error => console.log('error', error));
  };
};
