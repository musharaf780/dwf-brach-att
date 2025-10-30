import { EmployeeListDataActionConst } from '../Constants/EmployeeDataConst';

const initialState = {
  loading: false,
  employeeList: [],
  employeeListError: null,
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

    default:
      return state;
  }
};
