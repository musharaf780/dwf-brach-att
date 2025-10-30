import ApiConstants from '../../Constants/ApiConstants';


export const UserListDataAction = token => {
  return async dispatch => {
    try {
      console.log('User token:', token);

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
      console.log('EMPLOYEE LIST:', JSON.stringify(result));

      // You can dispatch the data to Redux if needed
      // dispatch({ type: 'FETCH_USER_LIST_SUCCESS', payload: result });
    } catch (error) {
      console.log('Error fetching user list:', error);
      // dispatch({ type: 'FETCH_USER_LIST_FAIL', payload: error });
    }
  };
};
