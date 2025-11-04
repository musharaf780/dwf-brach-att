import React, { useEffect, useState, useRef } from 'react';
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
  Button,
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
import Orientation from 'react-native-orientation-locker';
import RNFS from 'react-native-fs';
import {
  insertAttendanceRecord,
  getUnpushedRecordsCount,
  getAllAttendanceRecords,
} from '../../DB/EmployeePendingShift';
import CameraPopupLandscape from './CameraPopup/CameraPopupLandscape';
import { ShowToast } from '../ShowToast';
const DashboardLandcape = props => {
  const { loginSuccess } = useSelector(state => state.auth);
  const { loading, employeeList } = useSelector(state => state.employee);
  const [pendingCount, setPendingCounts] = useState(0);
  const isProcessingRef = useRef(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [imageString, setImageString] = useState(null);

  const camera = useRef(null);
  const isCapturingRef = useRef(false);
  const [showCameraPopup, setShowCameraPopup] = useState(false);

  const deviceFront = useCameraDevice('front');

  const dispatch = useDispatch();

  const SyncEmployeeList = () => {
    dispatch(
      EmployeeDataAction.EmployeeListDataAction(loginSuccess.access_token),
    );
  };

  const GetTheListFromLocal = () => {
    dispatch(EmployeeDataAction.GetAllEmployeeFromLocalDB());
  };

  const handleItemClick = async item => {
    setSelectedEmployee(item);
    setShowCameraPopup(true);
    // const success = await toggleEmployeeCheckIn(id);
    // if (success) {
    //   GetTheListFromLocal();
    // }
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
        paddingHorizontal: hp('2%'),
        borderRadius: hp('1%'),
        fontSize: hp('3%'),
      }}
    >
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
        -90, // rotation (keep 0 to respect EXIF)
        undefined, // outputPath
        false, // keepExif (true in some versions)
        {
          mode: 'contain',
          onlyScaleDown: false,
          compressFormat: 'JPEG',
          keepMeta: true,
        },
      );
      const base64 = await RNFS.readFile(compressed.path, 'base64');

      console.log('🧩 Short Base64 Preview:', JSON.stringify());
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
    try {
      let employeeId = selectedEmployee.id;
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
        selectedEmployee.id,
      )}${selectedEmployee?.checkIn ? 2 : 1}`;

      const data = {
        api_call_for: selectedEmployee.checkIn ? 'checkout' : 'checkin',
        employee_id: selectedEmployee.id,
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
        setSelectedEmployee(null);
        ShowToast('success', 'Attendance session', 'Shift saved successfully');
        setShowCameraPopup(false);
        GetTheListFromLocal();
      }
    } catch (error) {
      setImageString(null);
      setSelectedEmployee(null);
      ShowToast(
        'error',
        'Attandence session',
        'Something went wrong while saving your shift',
      );
      setShowCameraPopup(false);
    } finally {
      isProcessingRef.current = false; // 🔓 unlock instantly
    }
  };

  useEffect(() => {
    getUnpushedRecordsCount(
      count => setPendingCounts(count),
      err => setPendingCounts(0),
    );
  }, [employeeList]);

  const [uiRotation, setUiRotation] = useState(90);

  return (
    <View style={styles.mainContainer}>
      {/* Left Sidebar */}
      <View style={styles.sidebarContainer}>
        <View style={styles.logoWrapper}>
          <Image source={require('../../Assets/Images/dwflogo.jpg')} />
        </View>

        <View style={styles.welcomeWrapper}>
          <Paragraph style={styles.welcomeText} text="Welcome," />
          <Paragraph style={styles.branchText} text="Dammam Road Branch" />
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Paragraph style={styles.statPendingTitle} text="Pending Shift" />
            <Paragraph style={styles.statPendingValue} text={pendingCount} />
          </View>

          {/* Pushed Shift */}
          <View style={styles.statBoxAlt}>
            <Paragraph style={styles.statPushedTitle} text="Today’s" />
            <Paragraph style={styles.statPushedValue} text="200" />
          </View>
        </View>

        {/* Sync + Logout */}
        <View style={styles.footerButtonsContainer}>
          <TouchableOpacity
            onPress={() => {
              if (pendingCount === 0) {
                SyncEmployeeList();
              } else {
                ShowToast(
                  'error',
                  'Session Validation',
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
              <SearchTile />
            </View>

            <View style={styles.employeeContainer}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.employeeScroll}
              >
                {employeeList.map((item, index) => (
                  <View key={index.toString()} style={styles.employeeTile}>
                    <EmployyeTileLandscape
                      onItemClick={handleItemClick}
                      items={item}
                    />
                  </View>
                ))}
              </ScrollView>
            </View>

            <View style={styles.bottomContainer}>
              <TouchableOpacity onPress={() => {}} style={styles.bottomBar}>
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
