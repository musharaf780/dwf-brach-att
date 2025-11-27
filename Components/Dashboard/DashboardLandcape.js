import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  AppState,
  Platform,
  InteractionManager,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { ThemeColors } from '../../Constants/Color';
import IoIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Data } from '../../Constants/Data';
import EmployyeTileLandscape from '../../Components/EmployyeTileLandscape';
import Paragraph from '../Paragraph';
import * as EmployeeDataAction from '../../Store/Actions/EmployeeDataAction';
import { useDispatch, useSelector } from 'react-redux';
import { toggleEmployeeCheckIn } from '../../DB/EmployeeList';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import ImageResizer from 'react-native-image-resizer';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useFocusEffect } from '@react-navigation/native';
import { getPushedRecordsCount } from '../../DB/EmployeePushedShifts';
import RNFS from 'react-native-fs';
import {
  insertAttendanceRecord,
  getUnpushedRecordsCount,
  getAllAttendanceRecords,
} from '../../DB/EmployeePendingShift';
import CameraPopupLandscape from './CameraPopup/CameraPopupLandscape';
import { ShowToast } from '../ShowToast';
import PushRecordsToServerModal from '../PushRecordsToServerModal';
import ApiConstants from '../../Constants/ApiConstants';
const DashboardLandcape = props => {
  const { loginSuccess, userInformation } = useSelector(state => state.auth);
  const {
    loading,
    employeeList,
    pendingLoader,
    pendingShiftPostToServerStatus,
  } = useSelector(state => state.employee);
  const isiOS = Platform.OS === 'ios' ? true : false;
  const [pendingCount, setPendingCounts] = useState(0);
  const [pushedCount, setPushedCounts] = useState(0);
  const isProcessingRef = useRef(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [imageString, setImageString] = useState(null);
  const appState = React.useRef(AppState.currentState);
  const camera = useRef(null);
  const isCapturingRef = useRef(false);
  const [showCameraPopup, setShowCameraPopup] = useState(false);
  const selectedEmployeeRef = useRef(null);
  const deviceFront = useCameraDevice('front');
  const [search, setSearch] = useState('');

  const dispatch = useDispatch();

  const SyncEmployeeList = () => {
    dispatch(
      EmployeeDataAction.EmployeeListDataAction(loginSuccess.access_token),
    );
  };

  const GetTheListFromLocal = () => {
    dispatch(EmployeeDataAction.GetAllEmployeeFromLocalDB());
  };

  const askCameraPermission = async item => {
    let permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;

    const status = await check(permission);

    if (status === RESULTS.GRANTED) {
      // setShowCameraPopup(true);
    } else {
      const result = await request(permission);
      if (result === RESULTS.GRANTED) {
        // setShowCameraPopup(true);
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
        console.log(JSON.stringify(result), 'ExecuteSyncRecord');
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

  const handleItemClick = async item => {
    PushRecordToServer(false);
    ExecuteSyncRecord();
    await CheckCameraPermission(item);
  };

  useEffect(() => {
    const getPermissions = async () => {
      const granted = await askCameraPermission();
      setHasPermission(granted);
    };
    getPermissions();
  }, []);

  useEffect(() => {
    GetTheListFromLocal();
  }, [employeeList]);

  const SearchTile = () => (
    <View
      style={{
        backgroundColor: ThemeColors.white,
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        paddingHorizontal: hp('2%'),
        borderRadius: hp('1%'),
        marginVertical: hp('1%'),
      }}
    >
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search"
        placeholderTextColor={ThemeColors.light}
        style={{
          flex: 1,
          fontSize: hp('2%'),
          color: ThemeColors.dark,
          paddingVertical: hp('1%'),
        }}
        returnKeyType="search"
      />
      <TouchableOpacity
        style={{
          paddingLeft: hp('1%'),
        }}
        activeOpacity={0.7}
        onPress={() => console.log('Search Pressed')}
      >
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

    const employee = selectedEmployeeRef.current;
    if (!employee?.id) {
      ShowToast('error', 'Employee', 'No employee selected');
      isProcessingRef.current = false;
      return;
    }

    InteractionManager.runAfterInteractions(async () => {
      try {
        const currentDate = new Date();
        const utcDate = new Date(currentDate.toUTCString());
        const formattedDate = utcDate
          .toISOString()
          .slice(0, 19)
          .replace('T', ' ');

        const padZeros = num => String(num).padStart(6, '0');
        const formatMs = num => String(num).padEnd(3, '0').slice(0, 3);

        const [dateParts, timeParts] = formattedDate
          .split(' ')
          .map(part => part.split(/[-:]/));

        const ModifiedUniqueString = `${dateParts[0]}${dateParts[1]}${
          dateParts[2]
        }${timeParts[0]}${timeParts[1]}${timeParts[2]}${formatMs(
          currentDate.getMilliseconds(),
        )}${padZeros(employee.id)}${employee?.checkIn ? 2 : 1}`;

        const data = {
          api_call_for: employee.checkIn ? 'checkout' : 'checkin',
          employee_id: employee.id,
          add_date_flag: true,
          last_sync_seq: ModifiedUniqueString,
          isPushed: 0,
          createAt: new Date(),
          attachment: {
            name: currentDate.toString(),
            type: 'binary',
            datas: imageString, // base64 already small
          },
        };

        const [insertResult] = await Promise.all([
          insertAttendanceRecord(data),
          new Promise(resolve => setTimeout(resolve, 50)), // yield to UI briefly
        ]);

        if (insertResult) {
          Promise.all([
            toggleEmployeeCheckIn(employee.id),
            GetTheListFromLocal(),
          ]);

          setImageString(null);
          selectedEmployeeRef.current = null;
          setShowCameraPopup(false);
          ShowToast(
            'success',
            'Attendance session',
            'Shift saved successfully',
          );
        }
      } catch (error) {
        console.log('ProceedHandler error:', error);
        setImageString(null);
        selectedEmployeeRef.current = null;
        setShowCameraPopup(false);
        ShowToast('error', 'Attendance session', 'Something went wrong');
      } finally {
        isProcessingRef.current = false;
      }
    });
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

  const [uiRotation, setUiRotation] = useState(90);

  const PushRecordToServer = async loader => {
    console.log('TRIGGERR');
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
        console.log(JSON.stringify(result), 'asdfasdf');
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
    <View style={styles.mainContainer}>
      {/* Left Sidebar */}
      <View style={styles.sidebarContainer}>
        <View style={styles.logoWrapper}>
          <Image source={require('../../Assets/Images/dwflogo.jpg')} />
        </View>

        <View style={styles.welcomeWrapper}>
          <Paragraph style={styles.welcomeText} text="Welcome," />
          <Paragraph style={styles.branchText} text={userInformation?.name} />
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Paragraph style={styles.statPendingTitle} text="Pending Shift" />
            <Paragraph style={styles.statPendingValue} text={pendingCount} />
          </View>

          {/* Pushed Shift */}
          <View style={styles.statBoxAlt}>
            <Paragraph style={styles.statPushedTitle} text="Today’s" />
            <Paragraph style={styles.statPushedValue} text={pushedCount} />
          </View>
        </View>

        <View style={styles.footerButtonsContainer}>
          <TouchableOpacity
            disabled={loading}
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
            style={styles.footerButton}
          >
            <MaterialIcons
              name="sync"
              size={hp('3%')}
              color={ThemeColors.white}
            />
            <Paragraph
              style={styles.footerButtonText}
              text="Sync Employee List"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={props.logoutPress}
            style={styles.footerButton}
          >
            <MaterialIcons
              name="logout"
              size={hp('3%')}
              color={ThemeColors.white}
            />
            <Paragraph style={styles.footerButtonText} text="Logout" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.rightContainer}>
        {loading && (
          <View
            style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
          >
            <ActivityIndicator size={'large'} color={ThemeColors.primary} />
          </View>
        )}
        {!loading && (
          <>
            <View style={styles.searchContainer}>
              <View
                style={{
                  backgroundColor: ThemeColors.white,
                  width: '90%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'center',
                  paddingHorizontal: hp('2%'),
                  borderRadius: hp('1%'),
                  marginVertical: hp('1%'),
                }}
              >
                <TextInput
                  value={search}
                  onChangeText={text => setSearch(text)}
                  placeholder="Search"
                  placeholderTextColor={ThemeColors.light}
                  style={{
                    flex: 1,
                    fontSize: hp('2%'),
                    color: ThemeColors.dark,
                    paddingVertical: hp('1%'),
                  }}
                  returnKeyType="search"
                />
                <TouchableOpacity
                  style={{
                    paddingLeft: hp('1%'),
                  }}
                  activeOpacity={0.7}
                  onPress={() => console.log('Search Pressed')}
                >
                  <IoIcon
                    size={hp('2.2%')}
                    name="search-outline"
                    color={ThemeColors.light}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.employeeContainer}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.employeeScroll}
              >
                {employeeList.map((item, index) => {
                  if (
                    String(item?.name).trim().toUpperCase().includes(search)
                  ) {
                    return (
                      <View key={index.toString()} style={styles.employeeTile}>
                        <EmployyeTileLandscape
                          onItemClick={() => {
                            selectedEmployeeRef.current = item;
                            handleItemClick(item);
                          }}
                          items={item}
                        />
                      </View>
                    );
                  }
                })}
              </ScrollView>
            </View>

            <View style={styles.bottomContainer}>
              <TouchableOpacity
                onPress={() => {
                  PushRecordToServer(true);
                }}
                style={styles.bottomBar}
              >
                <MaterialIcons
                  name="fact-check"
                  color={ThemeColors.secondary}
                  size={hp('5%')}
                />
                <Paragraph
                  style={styles.bottomBarText}
                  text="Push Records to the server"
                />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      <CameraPopupLandscape
        loading={isProcessingRef.current}
        onProceed={ProceedHandler}
        visible={showCameraPopup}
        imageHave={imageString}
        onCapture={capturePhoto}
        onRetake={() => setImageString(null)}
        onClose={() => {
          setImageString(null);
          setShowCameraPopup(false);
        }}
      >
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            aspectRatio: 4 / 3, // keep consistent shape
          }}
        >
          {imageString ? (
            <Image
              style={{
                width: '80%',
                height: '100%',
                borderRadius: 10,
                resizeMode: 'cover', // match camera view behavior
              }}
              source={{ uri: `data:image/jpeg;base64,${imageString}` }}
            />
          ) : (
            <View
              style={{
                width: '80%',
                height: '100%',
                borderRadius: 10,
                overflow: 'hidden',
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
                onUIRotationChanged={setUiRotation}
              />
            </View>
          )}
        </View>
      </CameraPopupLandscape>
      <PushRecordsToServerModal visible={pendingLoader} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    width: '100%',
    flexDirection: 'row',
  },
  sidebarContainer: {
    height: '100%',
    width: '25%',
    backgroundColor: ThemeColors.primary,
  },
  logoWrapper: {
    height: '15%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  welcomeWrapper: {
    paddingHorizontal: '2%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: hp('2%'),
    color: ThemeColors.secondary,
  },
  branchText: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    color: ThemeColors.secondary,
  },
  statsContainer: {
    height: '50%',
    width: '100%',
    alignItems: 'center',
    marginTop: hp('1%'),
  },
  statBox: {
    height: hp('8%'),
    width: '90%',
    backgroundColor: ThemeColors.secondary,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: hp('2%'),
    borderRadius: hp('1%'),
  },
  statPendingTitle: {
    color: ThemeColors.primary,
    fontWeight: 'bold',
    fontSize: hp('2.2%'),
  },
  statPendingValue: {
    color: ThemeColors.primary,
    fontSize: hp('3%'),
    fontWeight: 'bold',
  },
  statBoxAlt: {
    height: hp('8%'),
    width: '90%',
    backgroundColor: ThemeColors.secondary,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: hp('2%'),
    borderRadius: hp('1%'),
    marginTop: hp('1.5%'),
  },
  statPushedTitle: {
    color: ThemeColors.primary,
    fontWeight: 'bold',
    fontSize: hp('2.2%'),
  },
  statPushedValue: {
    color: ThemeColors.primary,
    fontSize: hp('3%'),
    fontWeight: 'bold',
  },
  footerButtonsContainer: {
    height: '20%',
    width: '100%',
    paddingHorizontal: hp('2%'),
    justifyContent: 'center',
  },
  footerButton: {
    height: hp('6%'),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: hp('1%'),
    marginBottom: hp('1.5%'),
    paddingHorizontal: hp('1.5%'),
  },
  footerButtonText: {
    marginLeft: hp('1%'),
    color: ThemeColors.secondary,
    fontWeight: 'bold',
    fontSize: hp('1.9%'),
  },
  rightContainer: {
    height: '100%',
    width: '75%',
    backgroundColor: ThemeColors.secondary,
    borderTopLeftRadius: '2%',
    borderBottomLeftRadius: '2%',
  },
  searchContainer: {
    height: '15%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchTileContainer: {
    flexDirection: 'row',
    width: '90%',
    backgroundColor: ThemeColors.white,
    height: '40%',
    paddingHorizontal: hp('2%'),
    borderRadius: '2%',
  },
  searchInput: {
    flex: 1,
    color: ThemeColors.black,
    fontSize: hp('2'),
  },
  searchIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: hp('0.5%'),
  },
  employeeContainer: {
    height: '70%',
    width: '100%',
    paddingHorizontal: '5%',
  },
  employeeScroll: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  employeeTile: {
    width: '48%',
    marginBottom: 10,
  },
  bottomContainer: {
    height: '10%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    height: '80%',
    width: '80%',
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
    fontSize: hp('2.5%'),
  },
});

export default DashboardLandcape;
