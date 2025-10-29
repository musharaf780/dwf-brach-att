import { IsTabletActionConst } from '../Constants/AuthConstant';
import ApiConstants from '../../Constants/ApiConstants';
export const SetIsTabletLanscape = bool => {
  return async dispatch => {
    dispatch({
      type: IsTabletActionConst.IS_TABLET_HAVE,
      data: bool,
    });
  };
};

export const UserLoginAction = info => {
  return async dispatch => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(
      `${ApiConstants.BaseUrl}/authentication/oauth2/token?client_id=${ApiConstants.Client_id}&client_secret=${ApiConstants.Client_secret}&username=sadikh@dwf.com.sa&password=1&password_type=request-body&grant_type=password&login_type=user&db=${ApiConstants.DatabaseName}`,

      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        console.log(JSON.stringify(result));
        return;
      })
      .catch(error => console.log('error', error));
  };
};
