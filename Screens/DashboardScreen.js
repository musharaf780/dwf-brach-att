import DashboardLandcape from '../Components/Dashboard/DashboardLandcape';
import DashboardPortrait from '../Components/Dashboard/DashboardPortrait';
import { useSelector } from 'react-redux';
import * as AuthAction from '../Store /Actions/AuthAction';

import { useDispatch } from 'react-redux';
const SplashScreen = props => {
  const { isTablet } = useSelector(state => state.auth);
  const dispatch = useDispatch();

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

export default SplashScreen;
