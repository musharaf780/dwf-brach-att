import ApiConstants from '../../Constants/ApiConstants';
import { insertEmployeeList } from '../../DB/EmployeeList';

export const UserListDataAction = token => {
  return async dispatch => {
    try {
      const myHeaders = new Headers();
      myHeaders.append('Authorization', `Bearer ${token}`);

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      const response = await fetch(
        `${ApiConstants.BaseUrl}/user/fetch_subordinates?db=${ApiConstants.DatabaseName}`,
        requestOptions,
      );

      const result = await response.json();

      if (result.status === 200) {
        const data = Array.isArray(result?.sub_employees)
          ? result.sub_employees.map(emp => ({
              ...emp,
              checkIn: !!emp.is_geosess_active,
            }))
          : [];

        insertEmployeeList(data);
      } else {
        console.log('Unable to save user list data:', result);
      }
    } catch (error) {
      console.log('Error fetching user list:', error);
      // dispatch({ type: 'FETCH_USER_LIST_FAIL', payload: error });
    }
  };
};
