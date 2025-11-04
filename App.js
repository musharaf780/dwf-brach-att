// App.js
import React, { useEffect } from 'react';

import MainNavigator from './Nvigation/MianNavigator';
import { initDB } from './DB/Database';
import { initAuthDB } from './DB/AuthDatabse';
import { initEmployeeDB } from './DB/EmployeeList';
import { initEmployeePendingShiftDB } from './DB/EmployeePendingShift';
import { initializeEmployeePushedShiftTable } from './DB/EmployeePushedShifts';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import Toast from 'react-native-toast-message';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import AuthReducer from './Store/Reducers/AuthReducer';
import EmployeeDataReducer from './Store/Reducers/EmployeeDataReducer';
import { toastConfig } from './utils/toastConfig';
import DeviceInfo from 'react-native-device-info';
import { SetIsTabletLanscape } from './Store/Actions/AuthAction';

const App = () => {
  const rootReducer = combineReducers({
    auth: AuthReducer,
    employee: EmployeeDataReducer,
  });

  const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

  useEffect(() => {
    const init = async () => {
      const isTablet = await DeviceInfo.isTablet();
      store.dispatch(SetIsTabletLanscape(isTablet));
      SystemNavigationBar.navigationHide();
      initDB();
      initAuthDB();
      initEmployeeDB();
      initEmployeePendingShiftDB();
      initializeEmployeePushedShiftTable();
    };
    init();
  }, []);

  return (
    <Provider store={store}>
      <MainNavigator  />
      <Toast />
    </Provider>
  );
};

export default App;
