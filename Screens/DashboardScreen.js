import DashboardLandcape from '../Components/Dashboard/DashboardLandcape';
import DashboardPortrait from '../Components/Dashboard/DashboardPortrait';
import { useSelector } from 'react-redux';
const SplashScreen = props => {
  const { isTablet } = useSelector(state => state.auth);

  return isTablet ? (
    <DashboardLandcape
      onNavigate={() => {
        props.navigation.replace('LoginScreen');
      }}
    />
  ) : (
    <DashboardPortrait
      onNavigate={() => {
        props.navigation.replace('LoginScreen');
      }}
    />
  );
};

export default SplashScreen;
