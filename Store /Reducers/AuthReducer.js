import {
  IsTabletActionConst,
  UserLoginActionConst,
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
        loader: true,
        loginSuccess: action.data,
        loginFail: null,
      };
      break;

    case UserLoginActionConst.USER_LOGIN_FAIL:
      state = {
        ...state,
        loader: true,
        loginSuccess: null,
        loginFail: action.data,
      };
      break;
  }
  return state;
};
