import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Button,
  Linking,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Colors from '../../Constants/Color';
import MyHeader from '../../Components/UI-Support/MyHeader';
import * as AuthAction from '../../Store/Action/Auth/AuthAction';
import { useDispatch, useSelector } from 'react-redux';
import ApiConstants from '../../Constants/ApiConstants';
import SubHeadiing from '../../Components/UI-Support/SubHeading';
import Paragraph from '../../Components/UI-Support/Paragraph';
import FastImage from 'react-native-fast-image';
import * as DataAction from '../../Store/Action/Data/DataAction';
import messaging from '@react-native-firebase/messaging';
import FIcon from 'react-native-vector-icons/FontAwesome5';
import MaIcon from '../../Components/Icon/MaIcon';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import LoaderModal from '../../Components/UI-Support/LoaderModal';
import { launchCamera } from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import CameraPermissionErrorPopUp from '../../Components/UI-Support/CameraPermissionErrorPopUp';
import Toast from 'react-native-toast-notifications';
import {
  RequestUserPermission,
  NotificationListner,
} from '../../Constants/PushNotificationHalper';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import BackgroudLocationPermissionPopUp from '../../Components/UI-Support/BackgroudLocationPermissionPopUp';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import LottieView from 'lottie-react-native';
import SubHeading from '../../Components/UI-Support/SubHeading';
import CapturedPicturepopUp from '../../Components/UI-Support/CapturedPicturepopUp';
import SuccessModal from '../../Components/UI-Support/SuccessModal';
import BackgroundService from 'react-native-background-actions';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { useIsFocused } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import dateTime from 'date-time';
import AttandanceSuccPoPup from '../../Components/UI-Support/AttandanceSuccPoPup';
// import RNLocalize from "react-native-localize"
import NoInternetConnection from '../../Components/UI-Support/NoInternetConnection';
import { getTimeZone } from 'react-native-localize';
const HomeScreen = props => {
  const loginSuccessData = useSelector(state => state.auth.loginSuccessData);
  const userInfo = useSelector(state => state.auth.userInformation);
  const InternetState = useSelector(state => state.auth.internetState);
  const toast = useRef();
  const toastUpper = useRef();
  const Lang = useSelector(state => state.auth.lang);
  const [captureImg, setCaptureImg] = useState(false);
  const isFocused = useIsFocused();
  const [CameraPermissionPopUp, setCameraPermissionPopUp] = useState(false);
  const [CameraPermissionStatus, setCameraPermissionStatus] = useState();
  const [netInfo, setNetInfo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isCameraFront, setIsCameraFront] = useState(true);
  const [successModal, setSuccessModal] = useState(false);
  const [seccessMessage, setSuccessMessage] = useState('');
  const [allManagerBranches, setAllManagerBranches] = useState([]);

  const [ImageSource, setImageSource] = useState('');

  const camera = useRef(null);
  const devices = useCameraDevices();
  const deviceFront = devices?.front;
  const deviceBack = devices?.back;

  //Attandance States
  const [AttProperties, setAttProperties] = useState();

  const [CapImgUrlData, setCapImgUrlData] = useState();
  const [PreCheckInTime, setPreCheckInTime] = useState();

  const [locationPermissionPopUp, setLocationPermissionPopup] = useState(false);
  const [showInternet, setShowInternet] = useState(false);

  const [AttandanceSuccPopUp, setAttandanceSuccPopUp] = useState(false);
  const [AttandanceTime, setAttandanceTime] = useState();

  const GetAllManagerBranches = () => {
    var myHeaders = new Headers();
    myHeaders.append(
      'Authorization',
      `Bearer ${loginSuccessData?.access_token}`,
    );

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(
      `${ApiConstants.BaseUrl}/user/${loginSuccessData?.user_id}/fetch_branch_outlets?db=${ApiConstants.DatabaseName}`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        if (result.status === 200) {
          setAllManagerBranches(result?.outlets);
        }
      })
      .catch(error => console.log('error', error));
  };
  const FromOfflineEmp = useSelector(state => state.auth.fromOfflineEmp);

  useEffect(() => {
    if (userInfo?.manage_outlet_attendance) {
      props.navigation.replace('BranchAttandance');
    } else if (userInfo?.take_offline_attendance && !FromOfflineEmp) {
      props.navigation.replace('EmployeeAttandanceLocal');
    }
  }, [userInfo]);

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetInfo(state?.isConnected);
    });

    return () => {
      // Unsubscribe to network state updates
      unsubscribe();
    };
  }, []);

  const LoginSuccDataToRedux = async () => {
    const userData = await AsyncStorage.getItem('userInfo');
    const Data = await JSON.parse(userData);
    dispatch(AuthAction.SaveUserDataToReduxAction(Data));
  };

  // useEffect(() => {
  //   setShowInternet(InternetState)

  // }, [InternetState])

  function GetCurrentTimeInAM() {
    const currentTime = new Date();
    let hours = currentTime.getHours();
    let minutes = currentTime.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // '0' should be displayed as '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;

    const timeInAM = hours + ':' + minutes + ' ' + ampm;
    return timeInAM;
  }

  const GetBackgroudLocationPermission = () => {
    if (Platform.OS === 'ios') {
      request(PERMISSIONS.IOS.LOCATION_ALWAYS).then(result => {
        if (result === RESULTS.GRANTED) {
          console.log('Background location permission granted');
        } else {
          console.log('Background location permission denied');
        }
      });
    } else if (Platform.OS === 'android') {
      request(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION).then(result => {
        if (result === RESULTS.GRANTED) {
          console.log('Background location permission granted');
        } else {
          console.log('Background location permission denied');
        }
      });
    }
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      Camera.getCameraPermissionStatus().then(
        status => setCameraPermissionStatus(status),
        LoginSuccDataToRedux(),
      );
    });

    const subscribe = props.navigation.addListener('blur', () => {
      Camera.getCameraPermissionStatus().then(status =>
        setCameraPermissionStatus(status),
      );
    });
    return unsubscribe, subscribe;
  }, []);

  const GetSessionCheckInTime = id => {
    var myHeaders = new Headers();
    myHeaders.append(
      'Authorization',
      `Bearer ${loginSuccessData?.access_token}`,
    );
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(
      `${ApiConstants.BaseUrl}/geoloc_attendance_info/session/${id}?db=${ApiConstants.DatabaseName}`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        console.log(result.chk_in_date, 'result.chk_in_date');
        if (result.status === 200) {
          setPreCheckInTime(result.chk_in_date);
          saveCheckInTimeIntoStorage(moment(result.chk_in_date), {});
        }
      })
      .catch(error => console.log('error', error));
  };

  const [myTask, setMyTask] = useState([]);

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append(
      'Authorization',
      `Bearer ${loginSuccessData?.access_token}`,
    );
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(
      `${ApiConstants.BaseUrl}/task/list?page=1&items=100&my_tasks=1&db=${ApiConstants.DatabaseName}`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        if (result.status === 200) {
          setMyTask(result?.data);
        }
      })
      .catch(error => console.log('error', error));
  }, []);

  const [checkInLoader, setCheckInLoader] = useState(false);

  const [HomeScreenData, setHomeScreenData] = useState([
    {
      id: 1,
      name: `${Lang === 'en' ? 'All Notifications' : 'كافة الإخطارات'}`,
      color: '#75bde0',
      iconName: 'bell-badge',
    },
    {
      id: 2,
      name: `${Lang === 'en' ? 'Assets List' : 'قائمة الأصول'}`,
      color: '#78d1d3',
      iconName: 'format-list-text',
    },

    {
      id: 4,
      name: `${Lang === 'en' ? 'Employee Documents' : 'معلومات العقد'}`,
      color: '#98dbae',
      iconName: 'newspaper-variant-multiple-outline',
    },
    {
      id: 3,
      name: `${Lang === 'en' ? 'Pay Slips' : 'قسائم الدفع'}`,
      color: '#cee6ad',
      iconName: 'view-list-outline',
    },
    {
      id: 5,
      name: `${Lang === 'en' ? 'Contract Expiry Days' : 'أيام انتهاء العقد'}`,
      color: '#f5bbbb',
      iconName: 'calendar-clock',
    },
    {
      id: 6,
      name: `${Lang === 'en' ? 'All Employee' : 'كل موظف'}`,
      color: '#f3e0a7',
      iconName: 'account-group-outline',
    },
    {
      id: 7,
      name: `${Lang === 'en' ? 'My Task' : 'مهمتي'}`,
      color: '#c1aed4',
      iconName: 'clipboard-list-outline',
    },
    {
      id: 12,
      name: `${Lang === 'en' ? 'Opinions' : 'آراء'}`,
      color: '#d4e4fff0',
      iconName: 'graph-outline',
    },
    {
      id: 8,
      name: `${Lang === 'en' ? 'My Branches' : 'فروعي'}`,
      color: '#75bde0',
      iconName: 'office-building-cog',
    },
  ]);

  useEffect(() => {
    if (userInfo?.allow_employee_complain_menu) {
      const ItemHave = HomeScreenData?.find(i => i.id === 10);

      if (ItemHave) {
      } else {
        let List = HomeScreenData;

        List.push({
          id: 10,
          name: `${Lang === 'en' ? 'Branch Complaint' : 'شكوى الفرع'}`,
          color: '#fab08e',
          iconName: 'form-select',
        });
        setHomeScreenData(List);
      }
    }
  }, [userInfo]);

  const [AllCount, setALlCount] = useState();
  const [token, setToken] = useState();
  const [Announcement, setAnouncment] = useState([]);
  const [checkInState, setSetCheckInState] = useState(true);

  const RegisterDevice = async fcmToken => {
    const PlatformName = Platform.OS === 'ios' ? 'iOS' : 'Android';
    const VersionName = DeviceInfo?.getVersion().toString();
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append(
      'Authorization',
      `Bearer ${loginSuccessData?.access_token}`,
    );

    var raw = JSON.stringify({
      device_os: PlatformName,
      device_id: fcmToken,
      app_version: VersionName,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(
      `${ApiConstants.BaseUrl}/firebase/user/${loginSuccessData?.user_id}/add_device?db=${ApiConstants.DatabaseName}`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {})
      .catch(error => console.log('error', error));
  };

  const getToken = async () => {
    const fcmTokem = await messaging().getToken();

    setToken(fcmTokem);

    RequestUserPermission();
    NotificationListner();
  };

  useEffect(() => {
    getToken();
    if (token) {
      dispatch(DataAction.SaveFCMTokenAction(token));
      RegisterDevice(token);
    }
  }, [token]);

  const CheckAttandanceShift = () => {
    var myHeaders = new Headers();
    myHeaders.append(
      'Authorization',
      `Bearer ${loginSuccessData?.access_token}`,
    );

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(
      `${ApiConstants.BaseUrl}/user/${loginSuccessData?.user_id}/geolocation/properties_info?db=${ApiConstants.DatabaseName}`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        if (result?.status === 200) {
          setAttProperties(result?.data);
        }
      })
      .catch(error => console.log('error', error));
  };

  const GetAllNotification = () => {
    var myHeaders = new Headers();
    myHeaders.append(
      'Authorization',
      `Bearer ${loginSuccessData?.access_token}`,
    );

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,

      redirect: 'follow',
    };

    fetch(
      `${ApiConstants.BaseUrl}/firebase/user/fetch_notifications?db=${ApiConstants.DatabaseName}`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        if (result.status === 200) {
        }
      })
      .catch(error => console.log('error', error));
  };

  const GetAllHrAnnouncement = () => {
    var myHeaders = new Headers();
    myHeaders.append(
      'Authorization',
      `Bearer ${loginSuccessData?.access_token}`,
    );

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(
      `${ApiConstants.BaseUrl}/user/${loginSuccessData?.user_id}/employee/announcements_info?page=1&items=10&db=${ApiConstants.DatabaseName}`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        if (result.status === 200) {
          setAnouncment(result?.data[0] ? result?.data[0] : []);
        }
      })
      .catch(error => console.log('error', error));
  };
  const [userInforMation, setUserInforMation] = useState();
  const [profileLoader, setProfileLoader] = useState(true);

  useEffect(() => {
    // setProfileLoader(true)

    var myHeaders = new Headers();
    myHeaders.append(
      'Authorization',
      `Bearer ${loginSuccessData?.access_token}`,
    );

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(
      `${ApiConstants.BaseUrl}/user/${loginSuccessData?.user_id}/employee_info?db=${ApiConstants.DatabaseName}`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        if (result?.address) {
          // setProfileLoader(false)
          setUserInforMation(result);
          if (result?.branch_outlet_id?.name !== 'DWF Head Office') {
            list = HomeScreenData.filter(i => i.id !== 3);
            setHomeScreenData(list);
          }
        } else {
          setProfileLoader(false);
        }
      })
      .catch(error => console.log('error', error));
  }, []);

  const GetAllCounts = () => {
    var myHeaders = new Headers();
    myHeaders.append(
      'Authorization',
      `Bearer ${loginSuccessData?.access_token}`,
    );
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(
      `${ApiConstants.BaseUrl}/user/${loginSuccessData?.user_id}/dashboard_data?payslip_limit=50&db=${ApiConstants.DatabaseName}`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        if (result.data) {
          setALlCount(result.data);
        } else {
          console.log('NO DATA');
        }
      })
      .catch(error => console.log('error', error));
  };
  useEffect(() => {
    setTimeout(() => {
      setProfileLoader(false);
    }, 10000);
  }, []);
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      GetAllNotification();
      GetAllHrAnnouncement();
      GetAllCounts();
      CheckAttandanceShift();
      GetAllManagerBranches();
      // CheckCheckInTime()
    });

    const subscribe = props.navigation.addListener('blur', () => {
      GetAllNotification();
      GetAllHrAnnouncement();
      GetAllCounts();
      CheckAttandanceShift();
      // CheckCheckInTime()
    });
    return unsubscribe, subscribe;
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      DataAction.AllDropDownValuesAction(loginSuccessData?.access_token),
    );
  }, []);
  useEffect(() => {
    dispatch(AuthAction.UserProfileInfoAction(loginSuccessData?.access_token));
  }, []);

  useEffect(() => {
    GetAllNotification();
  }, []);

  const saveCheckInTimeIntoStorage = async (time, locationData) => {
    const data = {
      time: time,
      locationData: locationData,
    };
    await AsyncStorage.setItem('checkInTiime', JSON.stringify(data));
  };

  const [duration, setDuration] = useState('');

  useEffect(() => {
    if (AttProperties) {
      if (AttProperties?.is_geosess_active) {
        setSetCheckInState(false);
        GetSessionCheckInTime(AttProperties?.curr_geosess_id);
      } else {
        setSetCheckInState(true);
      }
    }
  }, [AttProperties]);

  const calculateDuration = async () => {
    const checkInTime = await AsyncStorage.getItem('checkInTiime');

    if (checkInTime) {
      const time = JSON.parse(checkInTime);

      let CurrentDate = new Date(time.time);
      CurrentDate.setHours(CurrentDate.getHours() + 5);
      CurrentDate.setMinutes(CurrentDate.getMinutes() + 30);
      const start = CurrentDate;
      const end = new Date();

      if (!isNaN(start) && !isNaN(end)) {
        const timeDifference = end - start;
        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutes = Math.floor(
          (timeDifference % (1000 * 60 * 60)) / (1000 * 60),
        );
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        setDuration(`${Number(hours)}hr : ${minutes}min : ${seconds}sec`);
      } else {
        setDuration('Invalid date format');
      }
    } else {
      setDuration(`${0}hr : ${0}min : ${0} sec`);
    }
  };

  console.log(JSON.stringify(DeviceInfo));
  //The below useeffect is for calculate time duration

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     //assign interval to a variable to clear it.
  //     calculateDuration();
  //   }, 1000);

  //   return () => clearInterval(intervalId); //This is important
  // }, []);

  const [seccRecord, setSuccessRecord] = useState();

  const LinkImageToRecord = (recordId, imageId) => {
    console.log(recordId, imageId);
    var myHeaders = new Headers();
    myHeaders.append(
      'Authorization',
      `Bearer ${loginSuccessData?.access_token}`,
    );

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(
      `${ApiConstants.BaseUrl}/attachment/${imageId}/link_record/geolocate_hr_attendance_session/${recordId}?db=${ApiConstants.DatabaseName}&link_record`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        console.log(result, 'LINK RECORD======');
        if (result) {
          setSuccessRecord();
        }
      })
      .catch(error => console.log('error =========>>>', error));
  };

  useEffect(() => {
    if (seccRecord && CapImgUrlData) {
      setTimeout(() => {
        LinkImageToRecord(seccRecord?.session_id, CapImgUrlData.data.id);
      }, 1000);
    }
  }, [seccRecord]);

  const EmployeeAttTracking = async (lat, long) => {
    const DateTime = dateTime();
    const PreList = await AsyncStorage.getItem('trackingObjects');

    let List = [];
    if (PreList) {
      List = await JSON.parse(PreList);
    }
    const AlreadyHave = List.find(
      i =>
        moment(i.dateTime).format('YYYY-MM-YY hh:mm') ===
        moment(DateTime).format('YYYY-MM-YY hh:mm'),
    );
    console.log(AlreadyHave, 'AlreadyHave---AlreadyHave');
    if (AlreadyHave) {
      console.log('ALREADY HAVE -----------');
    } else {
      // Step 1: Get the current date and time
      const currentDate = new Date();

      // Step 2: Convert it to UTC
      const utcDate = new Date(currentDate.toUTCString());

      // Step 3: Format the date in 24-hour format
      const formattedDate = utcDate
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');

      // // Display the formatted date
      // console.log(formattedDate);

      // console.log(List, "Before Push =======>")
      List.push({
        latitude: lat,
        longitude: long,
        dateTime: formattedDate,
      });
    }
    await AsyncStorage.setItem('trackingObjects', JSON.stringify(List));
  };

  const PushTrackingDateToServer = records => {
    var myHeaders = new Headers();
    myHeaders.append(
      'Authorization',
      `Bearer ${loginSuccessData?.access_token}`,
    );
    myHeaders.append('Content-Type', 'application/json');
    var raw = JSON.stringify({
      employee_id: userInfo?.employee_id?.id,
      session_id: AttProperties?.curr_geosess_id,
      latitude_pt: records.latitude,
      longitude_pt: records.longitude,
      loc_delay: false,
      add_date_flag: true,
      loc_date: records.dateTime,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    console.log(raw, 'TRACKING RAW +++++++');
    fetch(
      `${ApiConstants.BaseUrl}/geoloc_att/add_live_location?db=${ApiConstants.DatabaseName}`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => console.log(result, 'tracking RESPONSE'))
      .catch(error => console.log('error', error));
  };

  const CreateCheckInSessionRequest = async (locationCoordinates, date) => {
    var myHeaders = new Headers();
    myHeaders.append(
      'Authorization',
      `Bearer ${loginSuccessData?.access_token}`,
    );
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      employee_id: userInfo?.employee_id?.id,

      latitude_pt: locationCoordinates.coords.latitude,
      longitude_pt: locationCoordinates.coords.longitude,
    });
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(
      `${ApiConstants.BaseUrl}/geoloc_att/checkin?db=${ApiConstants.DatabaseName}`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        if (result.status === 200) {
          CheckAttandanceShift();
          setImageSource('');
          setSuccessRecord(result);
          setLoading(false);
          // setSuccessModal(true)
          // setSuccessMessage(`${userInforMation?.name} Attandance Mark Check In Successfully`)
          // toast.current.hideAll();
          // toast.current.show(`Attandance Mark Check In Successfully`);
          setAttandanceSuccPopUp(true);
          setAttandanceTime(GetCurrentTimeInAM());

          setCaptureImg(false);

          // LinkImageToRecord(result?.record_id, CapImgUrlData)
        }
      })
      .catch(error => console.log('error', error));
  };

  const CreateCheckInSessionRequestCheckOut = async (
    locationCoordinates,
    date,
  ) => {
    var myHeaders = new Headers();
    myHeaders.append(
      'Authorization',
      `Bearer ${loginSuccessData?.access_token}`,
    );
    myHeaders.append('Content-Type', 'application/json');
    var raw = JSON.stringify({
      employee_id: userInfo?.employee_id?.id,
      session_id: AttProperties?.curr_geosess_id,
      latitude_pt: locationCoordinates.coords.latitude,
      longitude_pt: locationCoordinates.coords.longitude,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(
      `${ApiConstants.BaseUrl}/geoloc_att/checkout?db=${ApiConstants.DatabaseName}`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        console.log(result, 'resultresultresult');
        if (result.status === 200) {
          const StopTracking = async () => {
            await BackgroundService.stop();
          };
          CheckAttandanceShift();
          setCaptureImg(false);
          setSuccessRecord(result);
          setLoading(false);
          // LinkImageToRecord(result?.record_id, CapImgUrlData)
          AsyncStorage.removeItem('checkInTiime');
          setSetCheckInState(true);
          StopTracking();
          // toast.current.hideAll();
          // toast.current.show(`Attandance Mark Check Out Successfully`);
          // setSetCheckInState(true)
          setAttandanceSuccPopUp(true);
          setAttandanceTime(GetCurrentTimeInAM());

          setCheckInLoader(false);
          CheckAttandanceShift();
        }
      })
      .catch(error => console.log('error', error));
  };

  const ConvertImageToUrl = (imageUri, fileName, type) => {
    const CurrDate = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    var myHeaders = new Headers();
    myHeaders.append(
      'Authorization',
      `Bearer ${loginSuccessData?.access_token}`,
    );
    const name = 'Attance';
    myHeaders.append('Content-Type', 'multipart/form-data');
    var formdata = new FormData();
    formdata.append('name', name);
    formdata.append('type', 'binary');
    formdata.append('datas', {
      uri: imageUri,
      type: type,
      name: 'Attance',
    });
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };
    fetch(
      `${ApiConstants.BaseUrl}/attachment/upload?db=${ApiConstants.DatabaseName}`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        console.log(result);

        if (result.status === 200) {
          setCapImgUrlData(result);
          setImageSource('');

          try {
            Geolocation.getCurrentPosition(info => {
              if (checkInState) {
                CreateCheckInSessionRequest(info, CurrDate);
              } else {
                CreateCheckInSessionRequestCheckOut(info, CurrDate);
              }
            });
          } catch (error) {}

          // CheckGeoLocationAccess(isCheckOut)
        } else {
          // setCheckInLoader(false)
        }
      })
      .catch(error => console.log('AttatchmentHandler', error));
  };

  const CheckLocationtrack = state => {
    try {
      Geolocation.getCurrentPosition(info => {
        var myHeaders = new Headers();
        myHeaders.append(
          'Authorization',
          `Bearer ${loginSuccessData?.access_token}`,
        );

        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow',
        };

        fetch(
          `${ApiConstants.BaseUrl}/user/${loginSuccessData?.user_id}/geoloc_att/location_access?att_type=${state}&latitude_pt=${info.coords.latitude}&longitude_pt=${info.coords.longitude}&db=${ApiConstants.DatabaseName}`,
          requestOptions,
        )
          .then(response => response.json())
          .then(result => {
            if (result.status === 200) {
              const StateType = !AttProperties.is_geosess_active
                ? 'checkin'
                : 'checkout';
              if (result.location_access) {
                if (AttProperties?.need_face_tracking_att) {
                  if (CameraPermissionStatus === 'authorized') {
                    // setCheckInLoader(true)
                    if (!checkInState) {
                      CaptureImage(true);
                    } else {
                      CaptureImage(false);
                    }
                  } else if (Platform.OS === 'ios') {
                    if (!checkInState) {
                      CaptureImage(true);
                    } else {
                      CaptureImage(false);
                    }
                  } else {
                    setCameraPermissionPopUp(true);
                  }
                } else {
                  try {
                    Geolocation.getCurrentPosition(info => {
                      if (StateType === 'checkout') {
                        CreateCheckInSessionRequest(info);
                      } else {
                        CreateCheckInSessionRequestCheckOut(info);
                      }
                    });
                  } catch (error) {
                    console.log(error);
                  }
                }
              } else {
                toast.current.hideAll();
                toast.current.show(`Location Access Denied`);
                setLoading(false);
              }
            }
          })
          .catch(error => console.log('error', error));
      });
    } catch (error) {}
  };

  const ProceedHandler = () => {
    setLoading(true);
    const imageUri = `file://'${ImageSource}`;
    const fileName = Math.random().toString();
    const type = 'image/jpg';

    if (ImageSource === '') {
      setLoading(false);
    } else {
      ConvertImageToUrl(imageUri, fileName, type, checkInState);
    }
  };

  const capturePhoto = async () => {
    const options = {
      qualityPrioritization: 'speed',
      skipMetadata: true,
      flash: 'off',
      width: 300,
      height: 300,
    };
    if (camera.current !== null) {
      const photo = await camera.current.takePhoto(options);
      console.log(photo, '__________UU');
      const compressImage = async imageUri => {
        try {
          const resizedImageUri = await ImageResizer.createResizedImage(
            imageUri,
            300, // Set your desired maximum width
            300, // Set your desired maximum height
            'JPEG', // Output type (e.g., JPEG, PNG)
            100, // Image quality (0 to 100)
            90,
          );

          // `resizedImageUri` contains the URI of the compressed image
          console.log('Compressed image URI:', resizedImageUri.uri);
          setImageSource(resizedImageUri.uri);
          // Now you can use `resizedImageUri.uri` to display or upload the compressed image
        } catch (error) {
          console.error('Error compressing image:', error);
        }
      };
      compressImage(photo.path);

      // setCaptureImg(false);
      // console.log(JSON.stringify(photo));
    }
  };

  const CaptureImage = isCheckOut => {
    setCaptureImg(true);

    return;

    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 450,
      maxWidth: 450,
      cameraType: 'front',
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.error) {
        console.log('Camera Error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        let fileName = response.fileName || response.assets?.[0]?.fileName;
        let type = response.type || response.assets?.[0]?.type;
        ConvertImageToUrl(imageUri, fileName, type, isCheckOut);

        // console.log(imageUri, "ddddsfasdf")
      }
    });
  };

  const sleep = time =>
    new Promise(resolve => setTimeout(() => resolve(), time));

  const veryIntensiveTask = async taskDataArguments => {
    // Example of an infinite loop task
    const { delay } = taskDataArguments;
    await new Promise(async resolve => {
      for (let i = 0; BackgroundService.isRunning(); i++) {
        Geolocation.getCurrentPosition(info => {
          EmployeeAttTracking(info.coords.latitude, info.coords.longitude);
        });
        await sleep(delay);
      }
    });
  };

  const options = {
    taskName: 'Attendance',
    taskTitle: 'Session start',
    taskDesc: 'Your Attendance Session Is Ongoing.',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: 'blck',
    linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
    parameters: {
      delay: 600000,
    },
  };

  const SartTracking = async () => {
    await BackgroundService.start(veryIntensiveTask, options);
    await BackgroundService.updateNotification({
      taskDesc: 'Your Session Started',
    });
  };

  useEffect(() => {
    if (AttProperties) {
      if (
        AttProperties?.need_live_tracking_att &&
        AttProperties?.is_geosess_active
      ) {
        SartTracking();
      }
    }
  }, [AttProperties]);

  const PushTrackingRecords = async (data, index, dataLength) => {
    PushTrackingDateToServer(data);
    if (index === dataLength) {
      await AsyncStorage.removeItem('trackingObjects');
      console.log('INSIDE FOR LOOP=====>');
    }
    console.log(data, '===', index, '===', dataLength);
  };

  const Looping = async () => {
    const PreList = await AsyncStorage.getItem('trackingObjects');
    const List = JSON.parse(PreList);

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    for (let i = 0, p = Promise.resolve(); i < List?.length; i++) {
      p = p
        .then(() => delay(Math.random() * 1500))
        .then(() => {
          console.log(List[i], '=====>', i);
          PushTrackingRecords(List[i], Number(i + 1), List?.length);
        });
    }
  };
  useEffect(() => {
    if (isFocused) {
      if (netInfo) {
        if (Platform.OS === 'android') {
          Looping();
        }
      }
    }
  }, [isFocused]);

  const checkLocationPermissions = async () => {
    const fineLocationResult = await check(
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    );
    const backgroundLocationResult = await check(
      PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
    );

    if (
      fineLocationResult === RESULTS.GRANTED &&
      backgroundLocationResult === RESULTS.GRANTED
    ) {
      // Both permissions are granted
      console.log('Both permissions are granted');
    } else {
      // One or both permissions are not granted
      // requestLocationPermissions();
      if (Platform.OS === 'android') {
        setLocationPermissionPopup(true);
      }

      console.log('Permission Is Not');
    }
  };

  const requestLocationPermissions = async () => {
    const fineLocationResult = await request(
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    );
    const backgroundLocationResult = await request(
      PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
    );

    if (
      fineLocationResult === RESULTS.GRANTED &&
      backgroundLocationResult === RESULTS.GRANTED
    ) {
      console.log('Both permissions are now granted');
      setLocationPermissionPopup(false);
    } else {
      console.log('One or both permissions are still not granted');
    }
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      checkLocationPermissions();
    });

    const subscribe = props.navigation.addListener('blur', () => {});
    return unsubscribe, subscribe;
  }, []);

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(state => {
      // dispatch(AuthAction.InternetConnectionState(state.isInternetReachable))
      setShowInternet(state.isInternetReachable);
      if (state.isInternetReachable) {
        GetAllNotification();
        GetAllHrAnnouncement();
        GetAllCounts();
        CheckAttandanceShift();
      }
    });

    return () => {
      // Unsubscribe to network state updates
      unsubscribe();
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bgColor }}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <MyHeader
        onPress={async () => {
          if (!FromOfflineEmp) {
            setTimeout(async () => {
              await AsyncStorage.removeItem('userInfo');
              console.log('HERE');
            }, 2000);
          }
          dispatch(AuthAction.LogOutAction());
          dispatch(
            AuthAction.LogOutApiAction(
              loginSuccessData.user_id,
              token,
              loginSuccessData.access_token,
            ),
          );

          props.navigation.replace('AuthNavigator');
        }}
      />
      {profileLoader && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.white,
          }}
        >
          <LoaderModal
            source={require('../../Assets/Animation/VCounter.json')}
          />
        </View>
      )}

      {!profileLoader && (
        <View style={{ height: '90%', width: '100%', paddingHorizontal: 10 }}>
          <View
            style={{
              height: '10%',
              marginTop: 5,
              justifyContent: 'center',
              flexDirection: 'row',
            }}
          >
            {userInforMation?.image && (
              <View
                style={{
                  height: '100%',
                  width: '20%',
                }}
              >
                <Image
                  source={{ uri: userInforMation?.image }}
                  style={{
                    flex: 1,
                    borderRadius: 50,
                    resizeMode: 'cover',
                    borderColor: Colors.black,
                    borderWidth: 0.5,
                  }}
                />
              </View>
            )}

            {!userInforMation?.image && (
              <View
                style={{
                  height: '100%',
                  width: '20%',
                }}
              >
                <Image
                  source={require('../../Assets/Images/user.png')}
                  style={{
                    borderRadius: 50,
                    resizeMode: 'cover',
                    borderColor: Colors.black,
                    borderWidth: 0.5,
                    height: 70,
                    width: 70,
                  }}
                />
              </View>
            )}

            <View
              style={{
                height: '100%',
                width: '80%',
                justifyContent: 'center',
                marginLeft: 10,
                marginTop: 5,
              }}
            >
              <SubHeadiing
                style={{
                  fontSize: 13,
                  color: Colors.primary,
                  textAlign: Lang === 'en' ? 'left' : 'left',
                }}
                text={userInforMation?.name}
              />
              <Paragraph
                style={{
                  fontSize: 10,
                  color: 'gray',
                  fontWeight: 'bold',
                  textAlign: 'left',
                }}
                text={userInforMation?.job_id}
              />
              <View style={{ width: '100%', flexDirection: 'row' }}>
                <View style={{ width: '50%', justifyContent: 'center' }}>
                  {/* <SubHeadiing style={{ color: Colors.btnBgColor }} text={duration} /> */}
                </View>

                {FromOfflineEmp && (
                  <TouchableOpacity
                    onPress={() => {
                      dispatch(AuthAction.RouterFromOfflineFlowAction(false));
                      props.navigation.replace('EmployeeAttandanceLocal');
                    }}
                    style={{
                      height: 40,
                      width: '45%',
                      backgroundColor: Colors.primary,
                      marginBottom: 10,
                      borderRadius: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <SubHeadiing
                      style={{ color: Colors.white }}
                      text={Lang === 'en' ? 'Attendance' : 'حضور'}
                    />
                  </TouchableOpacity>
                )}
                {!FromOfflineEmp && (
                  <>
                    {checkInLoader ? (
                      <View
                        style={{
                          width: '48%',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <ActivityIndicator
                          size={'large'}
                          color={Colors.primary}
                        />
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={async () => {
                          const StateType = !AttProperties.is_geosess_active
                            ? 'checkin'
                            : 'checkout';

                          if (
                            !AttProperties?.allow_chkin_outzone ||
                            !AttProperties?.allow_chkout_outzone
                          ) {
                            CheckLocationtrack(StateType);
                          } else {
                            if (AttProperties?.need_face_tracking_att) {
                              if (CameraPermissionStatus === 'authorized') {
                                // setCheckInLoader(true)
                                if (!checkInState) {
                                  CaptureImage(true);
                                } else {
                                  CaptureImage(false);
                                }
                              } else if (Platform.OS === 'ios') {
                                if (!checkInState) {
                                  CaptureImage(true);
                                } else {
                                  CaptureImage(false);
                                }
                              } else {
                                setCameraPermissionPopUp(true);
                              }
                            } else {
                              try {
                                Geolocation.getCurrentPosition(info => {
                                  if (StateType === 'checkin') {
                                    CreateCheckInSessionRequest(info);
                                  } else {
                                    CreateCheckInSessionRequestCheckOut(info);
                                  }
                                });
                              } catch (error) {
                                console.log(error);
                              }

                              // Direct Check in Checkout
                            }
                          }

                          return;

                          Looping();

                          if (
                            !AttProperties?.allow_chkin_outzone &&
                            !AttProperties?.need_face_tracking_att
                          ) {
                            alert('YYYY');
                          } else if (
                            AttProperties?.allow_chkin_outzone &&
                            AttProperties?.need_face_tracking_att
                          ) {
                            if (CameraPermissionStatus === 'authorized') {
                              // setCheckInLoader(true)
                              if (!checkInState) {
                                CaptureImage(true);
                              } else {
                                CaptureImage(false);
                              }
                            } else if (Platform.OS === 'ios') {
                              if (!checkInState) {
                                CaptureImage(true);
                              } else {
                                CaptureImage(false);
                              }
                            } else {
                              setCameraPermissionPopUp(true);
                            }
                          } else if (
                            !AttProperties?.need_face_tracking_att &&
                            AttProperties?.geolocation_hr_attendance
                          ) {
                            setCheckInLoader(true);
                            if (!checkInState) {
                              CheckGeoLocationAccess(true);
                            } else {
                              CheckGeoLocationAccess(false);
                            }
                          }
                        }}
                        style={{
                          width: '48%',
                          backgroundColor: checkInState
                            ? 'darkgreen'
                            : Colors.btnBgColor,
                          height: 35,
                          borderRadius: 10,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <SubHeadiing
                          style={{ color: Colors.white }}
                          text={checkInState ? 'Check In' : 'Check Out'}
                        />
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>
            </View>
          </View>

          {/* HR ANNOUNCEMTN TILE */}
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('AllHrAccouncement');
            }}
            style={{
              height: 80,
              width: '100%',
              backgroundColor: Colors.primary,
              marginTop: 10,
              borderRadius: 10,
              borderColor: Colors.primary,
              borderWidth: 0.5,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 10,
            }}
          >
            <View
              style={{
                height: 60,
                width: 60,
                backgroundColor: 'white',
                borderRadius: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {/* <View style={{ height: 15, width: 15, backgroundColor: Colors.btnBgColor, left: 12, top: 10, zIndex: 100,borderRadius }}>

              </View> */}
              <MIcon name="announcement" color={Colors.primary} size={30} />
            </View>

            <View
              style={{
                width: '80%',
                justifyContent: 'center',
                paddingHorizontal: 5,
              }}
            >
              <SubHeadiing
                style={{ fontSize: 15, color: 'white', textAlign: 'left' }}
                text={
                  Announcement?.title
                    ? Announcement?.title
                    : Lang === 'en'
                    ? 'HR Announcement'
                    : 'إعلان الموارد البشرية'
                }
              />
              <Paragraph
                style={{ fontSize: 12, color: 'white', textAlign: 'left' }}
                text={
                  Lang === 'en'
                    ? 'These announcements directly comming from higher management'
                    : '"تأتي هذه الإعلانات مباشرة من الإدارة العليا"'
                }
              />
            </View>
          </TouchableOpacity>
          {/* <Button title='Get' onPress={GetBackgroudLocationPermission} /> */}

          <View style={{ flex: 1, marginTop: 10, marginBottom: '13%' }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3}
              data={HomeScreenData}
              renderItem={itemData => {
                const Count =
                  itemData?.item?.id === 1
                    ? AllCount?.notifications
                    : itemData?.item?.id === 10
                    ? AllCount?.employee_complain
                    : itemData?.item?.id === 2
                    ? AllCount?.assets
                    : itemData?.item?.id === 3
                    ? AllCount?.payslips
                    : itemData?.item?.id === 12
                    ? AllCount?.opinions
                    : itemData?.item?.id === 7
                    ? myTask.length
                    : itemData?.item?.id === 6
                    ? AllCount?.subordinates > 0
                      ? Number(AllCount?.subordinates) - 1
                      : 0
                    : AllCount?.documents;
                return allManagerBranches.length <= 1 &&
                  itemData.item.id == 8 ? null : (
                  <TouchableOpacity
                    onPress={() => {
                      if (itemData.item.id === 1) {
                        props.navigation.navigate('NotificationScreens');
                      } else if (itemData.item.id === 2) {
                        props.navigation.navigate('AssetsList');
                      } else if (itemData.item.id === 3) {
                        props.navigation.navigate('MyPasySlips');
                      } else if (itemData.item.id === 4) {
                        props.navigation.navigate('PersonalDocuments');
                      } else if (itemData.item.id === 6) {
                        props.navigation.navigate('AllEmployeeList');
                      } else if (itemData.item.id === 7) {
                        props.navigation.navigate('MyTaskListScreen', {
                          reqData: myTask,
                        });
                      } else if (itemData.item.id === 12) {
                        props.navigation.navigate('AllOpinionScreen', {
                          reqData: myTask,
                        });
                      } else if (itemData.item.id === 8) {
                        props.navigation.navigate('ManagerAllBranches', {
                          reqData: allManagerBranches,
                          sessionId: AttProperties?.curr_geosess_id,
                        });
                      } else if (itemData.item.id === 10) {
                        props.navigation.navigate('ListOfAllComplainScreen');
                      }
                    }}
                    style={{
                      height: 140,
                      width: '30%',
                      backgroundColor: itemData.item.color,
                      margin: 5,
                      borderRadius: 10,
                      elevation: 1,
                      padding: 5,
                    }}
                  >
                    <View
                      style={{
                        width: '100%',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                      }}
                    >
                      <View
                        style={{
                          height: 40,
                          width: 40,
                          backgroundColor: Colors.authGray,
                          borderRadius: 50,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <MaIcon
                          name={itemData.item.iconName}
                          color={Colors.black}
                        />
                      </View>
                    </View>
                    <View style={{ height: '60%', justifyContent: 'flex-end' }}>
                      <SubHeading
                        style={{
                          fontSize: 18,
                          fontWeight: 'bold',
                          letterSpacing: 1.5,
                        }}
                        text={
                          itemData.item.id === 5
                            ? userInfo?.to_contract_expiry
                            : itemData.item.id === 8
                            ? Number(allManagerBranches?.length - 1)
                            : Count
                        }
                      />
                      <SubHeading
                        style={{
                          fontSize: 12,
                          letterSpacing: 1.5,
                          color: Colors.black,
                        }}
                        text={itemData.item.name}
                      />
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      )}

      <Toast style={{ marginBottom: '20%' }} ref={toast} />

      {captureImg && (
        <CapturedPicturepopUp
          proceedShow={ImageSource === '' ? false : true}
          captureShow={ImageSource === '' ? true : false}
          loading={loading}
          onChameraChange={() => setIsCameraFront(!isCameraFront)}
          onProceed={ProceedHandler}
          onRefresh={() => setImageSource('')}
          capturePicture={capturePhoto}
          onClose={() => setCaptureImg(false)}
          visible={captureImg}
        >
          <View>
            {ImageSource !== '' ? (
              <Image
                style={{ height: '100%', width: '100%' }}
                source={{ uri: `file://'${ImageSource}` }}
              />
            ) : (
              <Camera
                ref={camera}
                style={{ height: '100%', width: '100%' }}
                device={isCameraFront ? deviceFront : deviceBack}
                isActive={captureImg}
                photo={true}
              />
            )}
            <Toast style={{}} ref={toastUpper} />
          </View>
        </CapturedPicturepopUp>
      )}

      {CameraPermissionPopUp && (
        <CameraPermissionErrorPopUp
          visible={CameraPermissionPopUp}
          onPress={() => {
            setCameraPermissionPopUp(false);
            // props.navigation.goBack()
            Linking.openSettings();
          }}
        />
      )}
      {successModal && (
        <SuccessModal
          visible={successModal}
          onPress={() => {
            setSuccessModal(false);
            setSuccessMessage('');
          }}
          btnTitle={Lang === 'en' ? 'Continue' : 'يكمل'}
          message={seccessMessage}
        />
      )}
      {locationPermissionPopUp && (
        <BackgroudLocationPermissionPopUp
          onPressNo={() => {
            setLocationPermissionPopup(false);
          }}
          onPressYes={requestLocationPermissions}
        />
      )}

      {/* {
        showInternet === false && <NoInternetConnection
          visible={showInternet === false ? true : false}
          state={showInternet}
        />
      } */}
      {AttandanceSuccPopUp && (
        <AttandanceSuccPoPup
          visible={AttandanceSuccPopUp}
          time={AttandanceTime}
          onPress={() => setAttandanceSuccPopUp(false)}
        />
      )}
    </SafeAreaView>
  );
};
export default HomeScreen;
