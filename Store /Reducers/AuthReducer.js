import { IsTabletActionConst } from '../Constants/AuthConstant';

const initialState = {
  isTablet: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case IsTabletActionConst.IS_TABLET_HAVE:
      state = {
        ...state,
        isTablet: action.data,
      };
      break;
  }
  return state;
};
