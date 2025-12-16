import UserPendingShiftPortrait from '../Components/Dashboard/PendingShifts/UserPendingShiftPortrait';
import UserPendingShiftLandscape from '../Components/Dashboard/PendingShifts/UserPendingShiftLandscape';
import { useSelector } from 'react-redux';
import * as AuthAction from '../Store/Actions/AuthAction';
import { View, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
const PendingShift = props => {
  const { isTablet } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  return isTablet ? (
    <UserPendingShiftLandscape onGoBack={() => props.navigation.goBack()} />
  ) : (
    <UserPendingShiftPortrait onGoBack={() => props.navigation.goBack()} />
  );
};

export default PendingShift;
