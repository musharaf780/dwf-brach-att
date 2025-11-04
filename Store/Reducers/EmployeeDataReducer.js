import {
  EmployeeListDataActionConst,
  PendingShiftPostToServerActionConst,
} from '../Constants/EmployeeDataConst';

const initialState = {
  loading: false,
  employeeList: [],
  employeeListError: null,

  pendingLoader: false,
  pendingShiftPostToServerStatus: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case EmployeeListDataActionConst.GET_EMPLOYEE_LIST_RED:
      return {
        ...state,
        loading: true,
        employeeListError: null,
      };

    case EmployeeListDataActionConst.GET_EMPLOYEE_LIST_SUCC:
      return {
        ...state,
        loading: false,
        employeeList: action.data,
        employeeListError: null,
      };

    case EmployeeListDataActionConst.GET_EMPLOYEE_LIST_FAIL:
      return {
        ...state,
        loading: false,
        employeeListError: action.message,
      };

    case PendingShiftPostToServerActionConst.PENDING_SHIFT_POST_REQ:
      return {
        ...state,
        pendingLoader: true,
        pendingShiftPostToServerStatus: null,
      };

    case PendingShiftPostToServerActionConst.PENDING_SHIFT_POST_SUCC:
      return {
        ...state,
        pendingLoader: false,
        pendingShiftPostToServerStatus: action.status,
      };

    case PendingShiftPostToServerActionConst.PENDING_SHIFT_POST_FAIL:
      return {
        ...state,
        pendingLoader: false,
        pendingShiftPostToServerStatus: action.status,
      };

    default:
      return state;
  }
};
