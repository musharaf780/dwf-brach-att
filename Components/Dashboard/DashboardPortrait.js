import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
  ActivityIndicator,
  openSettings,
  Linking,
  AppState,
  Button,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { ThemeColors } from '../../Constants/Color';
import IoIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import EmployeeTile from '../EmployeeTile';
import Paragraph from '../Paragraph';
import * as EmployeeDataAction from '../../Store/Actions/EmployeeDataAction';
import { useDispatch, useSelector } from 'react-redux';
import { toggleEmployeeCheckIn } from '../../DB/EmployeeList';
import CameraPopupPortrail from './CameraPopup/CameraPopupPortrail';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import ImageResizer from 'react-native-image-resizer';
import { useFocusEffect } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import {
  insertAttendanceRecord,
  getUnpushedRecordsCount,
  getAllAttendanceRecords,
} from '../../DB/EmployeePendingShift';
import { getPushedRecordsCount } from '../../DB/EmployeePushedShifts';
import { ShowToast } from '../ShowToast';
import ApiConstants from '../../Constants/ApiConstants';
import PushRecordsToServerModal from '../PushRecordsToServerModal';

const DashboardPortrait = props => {
  const { loginSuccess } = useSelector(state => state.auth);
  const {
    loading,
    employeeList,
    pendingLoader,
    pendingShiftPostToServerStatus,
  } = useSelector(state => state.employee);
  const [pendingCount, setPendingCounts] = useState(0);
  const [pushedCount, setPushedCounts] = useState(0);
  const isProcessingRef = useRef(false);

  const [imageString, setImageString] = useState(null);
  const appState = React.useRef(AppState.currentState);
  const camera = useRef(null);
  const isCapturingRef = useRef(false);
  const [showCameraPopup, setShowCameraPopup] = useState(false);
  const isiOS = Platform.OS === 'ios' ? true : false;
  const deviceFront = useCameraDevice('front');

  const selectedEmployeeRef = useRef(null);

  const dispatch = useDispatch();

  const SyncEmployeeList = () => {
    dispatch(
      EmployeeDataAction.EmployeeListDataAction(loginSuccess.access_token),
    );
  };

  const GetTheListFromLocal = () => {
    dispatch(EmployeeDataAction.GetAllEmployeeFromLocalDB());
  };

  useEffect(() => {
    GetTheListFromLocal();
  }, [employeeList]);

  const SearchTile = () => (
    <View style={styles.searchContainer}>
      <TextInput
        placeholder="Search"
        placeholderTextColor={ThemeColors.light}
        style={styles.searchInput}
      />
      <TouchableOpacity style={styles.searchIcon}>
        <IoIcon
          size={hp('2.2%')}
          name="search-outline"
          color={ThemeColors.light}
        />
      </TouchableOpacity>
    </View>
  );

  const capturePhoto = async () => {
    if (isCapturingRef.current) return;
    isCapturingRef.current = true;

    if (camera.current == null) {
      isCapturingRef.current = false;
      return;
    }

    try {
      const photo = await camera.current.takePhoto({
        flash: 'off',
      });

      const compressed = await ImageResizer.createResizedImage(
        photo.path,
        400,
        400,
        'JPEG',
        20,
        isiOS ? 0 : -90,
        undefined,
        false,
        {
          mode: 'contain',
          onlyScaleDown: false,
          compressFormat: 'JPEG',
          keepMeta: true,
        },
      );
      const base64 = await RNFS.readFile(compressed.path, 'base64');

      setImageString(base64);
    } catch (error) {
      console.log('Error capturing photo:', error);
    } finally {
      isCapturingRef.current = false;
    }
  };

  const ProceedHandler = async () => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    if (!selectedEmployeeRef.current?.id) {
      ShowToast('error', 'Employee', 'No employee selected');
      isProcessingRef.current = false;
      return;
    }
    try {
      let employeeId = selectedEmployeeRef.current.id;
      const currentDate = new Date();
      const utcDate = new Date(currentDate.toUTCString());
      const formattedDate = utcDate
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');
      const PadNumberWithZeros = num => String(num).padStart(6, '0');

      const manipulateNumber = num => {
        const numStr = String(num);
        return numStr.length < 3 ? numStr.padEnd(3, '0') : numStr.slice(0, 3);
      };
      const milliseconds = String(currentDate.getMilliseconds()).slice(0, 3);
      const [formattedDateOnly, formattedTimeOnly] = formattedDate
        .split(' ')
        .map(part => part.split(/[-:]/));

      const ModifiedUniqueString = `${formattedDateOnly[0]}${
        formattedDateOnly[1]
      }${formattedDateOnly[2]}${formattedTimeOnly[0]}${formattedTimeOnly[1]}${
        formattedTimeOnly[2]
      }${manipulateNumber(milliseconds)}${PadNumberWithZeros(
        selectedEmployeeRef.current.id,
      )}${selectedEmployeeRef.current?.checkIn ? 2 : 1}`;

      const data = {
        api_call_for: selectedEmployeeRef?.current?.checkIn
          ? 'checkout'
          : 'checkin',
        employee_id: selectedEmployeeRef?.current?.id,
        add_date_flag: true,
        attachment: {
          name: currentDate.toString(),
          type: 'binary',
          datas: imageString,
        },
        last_sync_seq: ModifiedUniqueString,
        isPushed: 0,
        createAt: new Date(),
      };

      const insert = await insertAttendanceRecord(data);

      if (insert) {
        await toggleEmployeeCheckIn(employeeId);
        setImageString(null);

        selectedEmployeeRef.current = null;
        ShowToast('success', 'Attendance session', 'Shift saved successfully');
        setShowCameraPopup(false);
        GetTheListFromLocal();
      }
    } catch (error) {
      setImageString(null);

      selectedEmployeeRef.current = null;
      ShowToast(
        'error',
        'Attandence session',
        'Something went wrong while saving your shift',
      );
      setShowCameraPopup(false);
    } finally {
      isProcessingRef.current = false;
    }
  };

  useEffect(() => {
    getUnpushedRecordsCount(
      count => setPendingCounts(count),
      err => setPendingCounts(0),
    );

    getPushedRecordsCount(
      count => setPushedCounts(count),
      err => setPushedCounts(0),
    );
  }, [employeeList]);

  const askCameraPermission = async item => {
    let permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;

    const status = await check(permission);

    if (status === RESULTS.GRANTED) {
      setShowCameraPopup(true);
      ShowToast('success', 'Camera', 'Camera permission already granted');
    } else {
      const result = await request(permission);
      if (result === RESULTS.GRANTED) {
        setShowCameraPopup(true);
        ShowToast(
          'success',
          'Camera',
          'Camera permission granted successfully',
        );
      } else if (result === RESULTS.BLOCKED) {
        ShowToast(
          'error',
          'Camera',
          'Camera permission is blocked. Please enable it from settings.',
          openAppSettings(),
        );
      } else {
        ShowToast('error', 'Camera', 'Camera permission not granted');
      }
    }
  };

  const CheckCameraPermission = async item => {
    let permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;

    const status = await check(permission);

    if (status === RESULTS.GRANTED) {
      setShowCameraPopup(true);
      ShowToast('success', 'Camera', 'Camera permission already granted');
    } else {
      await askCameraPermission(item);
    }
  };

  const openAppSettings = async () => {
    try {
      await openSettings();
    } catch (error) {
      // Fallback in case openSettings() fails on some devices
      Linking.openSettings().catch(() => {
        console.warn('Unable to open app settings');
      });
    }
  };

  const handleItemClick = async item => {
    ExecuteSyncRecord();
    await CheckCameraPermission(item);
  };

  const CheckPendingValidation = () => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${loginSuccess.access_token}`);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(
      `${ApiConstants.BaseUrl}/geoloc_att/off_att_push/check_sync`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        if (result.status === 200) {
          const { pending_records } = result;
          if (pending_records.length === 0) {
            SyncEmployeeList();
          } else {
            ShowToast(
              'error',
              'Session Validation',
              'You need to push all your existing sessions before syncing the employee list.',
            );
          }
        } else {
          ShowToast('error', 'Error', 'Oops! Something went wrong.');
        }
      })
      .catch(error =>
        console.error('Error checking pending validation:', error),
      );
  };

  const PushRecordToServer = async loader => {
    if (pendingCount === 0 && loader) {
      ShowToast(
        'error',
        'Pending Records',
        'There are no pending records to push.',
      );
      return;
    }

    try {
      const Data = await getAllAttendanceRecords();

      dispatch(
        EmployeeDataAction.PendingShiftPostToServerAction(
          loginSuccess.access_token,
          Data,
          loader,
        ),
      );
    } catch (err) {
      console.error('Error fetching attendance records:', err);
    }
  };

  useEffect(() => {
    if (pendingShiftPostToServerStatus) {
      ShowToast(
        pendingShiftPostToServerStatus?.type,
        'Shifts Status',
        pendingShiftPostToServerStatus?.status,
      );
    }
  }, [pendingLoader]);

  const ExecuteSyncRecord = () => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${loginSuccess.access_token}`);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(
      `${ApiConstants.BaseUrl}/geoloc_att/off_att_push/execute_sync`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        if (result?.success) {
          ShowToast('success', 'Execute Sync', 'All Records Sync successfully');
        } else {
          ShowToast(
            'error',
            'Execute Sync',
            'All Records not Sync successfully',
          );
        }
      })
      .catch(error => console.error(error));
  };

  useFocusEffect(
    useCallback(() => {
      PushRecordToServer(false);

      const subscription = AppState.addEventListener('change', nextAppState => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          PushRecordToServer(false);
        }
        appState.current = nextAppState;
      });

      return () => {
        subscription.remove();
      };
    }, []),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={Platform.OS === 'ios' ? 'light-content' : 'light-content'}
      />

      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.topRow}>
            <View style={styles.logoContainer}>
              <Image
                style={styles.logoImage}
                source={require('../../Assets/Images/dwflogo.jpg')}
              />
            </View>

            <View style={styles.welcomeContainer}>
              <View style={styles.welcomeInner}>
                <Paragraph style={styles.welcomeText} text="Welcome," />
                <Paragraph
                  style={styles.branchText}
                  text="Dammam Road Branch"
                />
              </View>
            </View>

            <View style={styles.iconContainer}>
              <TouchableOpacity
                onPress={() => {
                  if (pendingCount === 0) {
                    CheckPendingValidation();
                  } else {
                    ShowToast(
                      'error',
                      'App Validation',
                      'You need to push all your existing sessions before syncing the employee list.',
                    );
                  }
                }}
                style={styles.iconButton}
              >
                <MaterialIcons
                  name="sync"
                  size={hp('2.3%')}
                  color={ThemeColors.white}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={props.logoutPress}
                style={styles.iconButton}
              >
                <MaterialIcons
                  name="logout"
                  size={hp('2.3%')}
                  color={ThemeColors.white}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={styles.statLeft}>
                <Paragraph style={styles.statTitle} text={`Pending\nShift`} />
              </View>
              <View style={styles.statRight}>
                <Paragraph style={styles.statValue} text={`${pendingCount}`} />
              </View>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statLeft}>
                <Paragraph style={styles.statTitle} text={`Today’s\n`} />
              </View>
              <View style={styles.statRight}>
                <Paragraph style={styles.statValue} text={pushedCount} />
              </View>
            </View>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <View style={styles.innerContainer}>
            <SearchTile />

            {loading && (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ActivityIndicator size={'large'} color={ThemeColors.primary} />
              </View>
            )}
            {!loading && (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                {employeeList.map((item, index) => (
                  <EmployeeTile
                    onItemClick={() => {
                      selectedEmployeeRef.current = item;
                      handleItemClick(item);
                    }}
                    key={index.toString()}
                    items={item}
                  />
                ))}
              </ScrollView>
            )}
          </View>

          <TouchableOpacity
            onPress={() => {
              PushRecordToServer(true);
            }}
            style={styles.bottomBar}
          >
            <MaterialIcons
              name="fact-check"
              color={ThemeColors.secondary}
              size={hp('3%')}
            />
            <Paragraph
              style={styles.bottomBarText}
              text="Push Records to the server"
            />
          </TouchableOpacity>
        </View>
      </View>
      <CameraPopupPortrail
        loading={isProcessingRef.current}
        onProceed={ProceedHandler}
        visible={showCameraPopup}
        imageHave={imageString}
        onCapture={capturePhoto}
        onRetake={() => setImageString(null)}
        onClose={() => {
          setImageString(null);
          setTimeout(() => setShowCameraPopup(false), 300);
        }}
      >
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}
        >
          {imageString ? (
            <Image
              style={{
                width: '90%',
                aspectRatio: 3 / 4,
                borderRadius: 10,
                resizeMode: 'contain',
              }}
              source={{ uri: `data:image/jpeg;base64,${imageString}` }}
            />
          ) : (
            <View
              style={{
                width: '90%',
                aspectRatio: 3 / 4,
                borderRadius: 10,
                overflow: 'hidden', // Prevents camera overflow
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Camera
                ref={camera}
                style={{ width: '100%', height: '100%' }}
                device={deviceFront}
                isActive={showCameraPopup}
                photo={true}
              />
            </View>
          )}
        </View>
      </CameraPopupPortrail>
      <PushRecordsToServerModal visible={pendingLoader} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ThemeColors.primary,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    height: hp('20%'),
    width: wp('100%'),
  },
  topRow: {
    height: '50%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    height: hp('15%'),
    width: wp('15%'),
    resizeMode: 'center',
  },
  welcomeContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeInner: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  welcomeText: {
    fontSize: hp('1.7%'),
  },
  branchText: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
  },
  iconContainer: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconButton: {
    padding: hp('0.5%'),
  },
  statsRow: {
    height: '50%',
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: wp('5%'),
    justifyContent: 'space-between',
  },
  statCard: {
    height: hp('8%'),
    width: wp('42%'),
    borderRadius: hp('1%'),
    borderWidth: 1,
    borderColor: ThemeColors.secondary,
    padding: hp('1%'),
    justifyContent: 'space-between',
  },
  statLeft: {
    alignSelf: 'flex-start',
  },
  statRight: {
    alignSelf: 'flex-end',
  },
  statTitle: {
    fontWeight: 'bold',
    color: ThemeColors.secondary,
    fontSize: hp('2%'),
  },
  statValue: {
    color: ThemeColors.secondary,
    fontWeight: 'bold',
    fontSize: hp('2%'),
    bottom: hp('2%'),
  },
  contentSection: {
    flex: 1,
    backgroundColor: ThemeColors.secondary,
    borderTopRightRadius: hp('4%'),
    borderTopLeftRadius: hp('4%'),
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp('2%'),
    paddingBottom: Platform.OS === 'android' ? hp('4.5%') : hp('1%'),
  },
  innerContainer: {
    height: '85%',
    width: '90%',
  },
  searchContainer: {
    height: hp('5%'),
    width: '100%',
    backgroundColor: 'white',
    borderRadius: hp('1%'),
    borderColor: ThemeColors.light,
    borderWidth: hp('0.08%'),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: hp('1.5%'),
  },
  searchInput: {
    flex: 1,
    color: ThemeColors.black,
    fontSize: hp('1.6%'),
  },
  searchIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: hp('0.5%'),
  },
  scrollContent: {
    paddingVertical: hp('1%'),
  },
  bottomBar: {
    height: hp('5%'),
    width: '90%',
    backgroundColor: ThemeColors.primary,
    borderRadius: hp('1%'),
    marginTop: hp('2%'),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBarText: {
    marginLeft: hp('1%'),
    fontWeight: '600',
    color: ThemeColors.white,
    fontSize: hp('1.7%'),
  },
});

export default DashboardPortrait;
