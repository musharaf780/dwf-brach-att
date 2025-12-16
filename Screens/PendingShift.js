import UserPendingShiftPortrait from '../Components/Dashboard/PendingShifts/UserPendingShiftPortrait';
import { useSelector } from 'react-redux';
import * as AuthAction from '../Store/Actions/AuthAction';
import { View, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
const PendingShift = props => {
  const { isTablet } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  return (
    <UserPendingShiftPortrait onGoBack={() => props.navigation.goBack()} />
  );
  return isTablet ? (
    <DashboardLandcape
      logoutPress={() => {
        dispatch(AuthAction.UserLogoutAction());
        props.navigation.replace('LoginScreen');
      }}
      onNavigate={() => {
        props.navigation.replace('LoginScreen');
      }}
    />
  ) : (
    <DashboardPortrait
      logoutPress={() => {
        dispatch(AuthAction.UserLogoutAction());
        props.navigation.replace('LoginScreen');
      }}
      onNavigate={() => {
        props.navigation.replace('LoginScreen');
      }}
    />
  );
};

export default PendingShift;
