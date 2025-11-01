import ApiConstants from '../../Constants/ApiConstants';
import { insertEmployeeList, getAllEmployees } from '../../DB/EmployeeList';
import { EmployeeListDataActionConst } from '../Constants/EmployeeDataConst';

export const GetAllEmployeeFromLocalDB = () => {
  return async dispatch => {
    try {
      const employees = await getAllEmployees();
      if (employees.length > 0) {
        dispatch({
          type: EmployeeListDataActionConst.GET_EMPLOYEE_LIST_SUCC,
          data: employees,
        });
      } else {
        dispatch({
          type: EmployeeListDataActionConst.GET_EMPLOYEE_LIST_FAIL,
          message: 'There is no data to sync',
        });
      }
    } catch (error) {
      console.log('Error loading employees from local DB:', error.message);
    }
  };
};

export const EmployeeListDataAction = token => {
  return async dispatch => {
    try {
      dispatch({ type: EmployeeListDataActionConst.GET_EMPLOYEE_LIST_RED });
      await dispatch(GetAllEmployeeFromLocalDB());

      const myHeaders = new Headers();
      myHeaders.append('Authorization', `Bearer ${token}`);

      const response = await fetch(
        `${ApiConstants.BaseUrl}/user/fetch_subordinates?db=${ApiConstants.DatabaseName}`,
        { method: 'GET', headers: myHeaders, redirect: 'follow' },
      );

      const result = await response.json();

      if (result.status === 200 && Array.isArray(result?.sub_employees)) {
        let list = result.sub_employees;
        for (let i = 0; i < list.length; i++) {
          if (list[i].is_geosess_active) {
            list[i]['checkIn'] = 1;
          } else {
            list[i]['checkIn'] = 0;
          }
        }
        // const data = result.sub_employees.map(emp => ({
        //   ...emp,
        //   checkIn: !!emp.is_geosess_active,
        // }));

        insertEmployeeList(list);
        await dispatch(GetAllEmployeeFromLocalDB());
      } else {
        dispatch({
          type: EmployeeListDataActionConst.GET_EMPLOYEE_LIST_FAIL,
          message: 'Unable to fetch employee list. Please try again later.',
        });
      }
    } catch (error) {
      console.log('Error fetching employee list:', error);
      dispatch({
        type: EmployeeListDataActionConst.GET_EMPLOYEE_LIST_FAIL,
        message:
          'Something went wrong while loading employees. Please check your connection.',
      });
    }
  };
};
