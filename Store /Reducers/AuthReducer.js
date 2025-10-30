import {
  IsTabletActionConst,
  UserLoginActionConst,
  UserAuthDataToReduxActionConst,
} from '../Constants/AuthConstant';

const initialState = {
  isTablet: false,
  loader: false,
  loginSuccess: null,
  loginFail: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case IsTabletActionConst.IS_TABLET_HAVE:
      state = {
        ...state,
        isTablet: action.data,
      };
      break;

    case UserLoginActionConst.USER_LOGIN_REQ:
      state = {
        ...state,
        loader: true,
      };
      break;

    case UserLoginActionConst.USER_LOGIN_SUCC:
      state = {
        ...state,
        loader: false,
        loginSuccess: action.data,
        loginFail: null,
      };
      break;

    case UserLoginActionConst.USER_LOGIN_FAIL:
      state = {
        ...state,
        loader: false,
        loginSuccess: null,
        loginFail: action.data,
      };
      break;

    case UserAuthDataToReduxActionConst.SAVE_USERDATA_TO_REDUX:
      state = {
        ...state,

        loginSuccess: action.data,
      };
      break;

    case UserLoginActionConst.USER_LOGOUT:
      state = {
        ...state,
        loginSuccess: null,
      };
      break;
  }
  return state;
};
