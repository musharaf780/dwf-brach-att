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
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { ThemeColors } from '../../Constants/Color';
import IoIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Data } from '../../Constants/Data';
import EmployeeTile from '../EmployeeTile';
import Paragraph from '../Paragraph';
import * as EmployeeDataAction from '../../Store /Actions/EmployeeDataAction';
import { useDispatch, useSelector } from 'react-redux';
import { toggleEmployeeCheckIn } from '../../DB/EmployeeList';
import CameraPopupPortrail from './CameraPopup/CameraPopupPortrail';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
const DashboardPortrait = props => {
  const { loginSuccess } = useSelector(state => state.auth);
  const { loading, employeeList } = useSelector(state => state.employee);

  const [hasPermission, setHasPermission] = useState(false);

  const [imageString, setImageString] = useState(null);

  const camera = useRef(null);
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

  const handleItemClick = async id => {
    setShowCameraPopup(true);
    const success = await toggleEmployeeCheckIn(id);
    if (success) {
      GetTheListFromLocal();
    }
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
  }, []);

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
    if (camera.current == null) return;
    try {
      const photo = await camera.current.takePhoto({
        flash: 'off',
      });

      const compressed = await ImageResizer.createResizedImage(
        photo.path,
        500,
        500,
        'JPEG',
        30,
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
      console.error('❌ Error capturing photo:', error);
    }

    // try {
    //   const photo = await camera.current.takePhoto({
    //     flash: 'off',
    //   });
    //   console.log('📸 Photo captured:', photo);
    //   console.log('Photo Captured', 'Front camera photo saved successfully!');
    //   if (photo) {
    //     setShowCameraPopup(false);
    //   }
    // } catch (error) {
    //   console.error('Error capturing photo:', error);
    // }
  };

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

            {/* Action Icons */}
            <View style={styles.iconContainer}>
              <TouchableOpacity
                onPress={SyncEmployeeList}
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
                <Paragraph style={styles.statValue} text={`30`} />
              </View>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statLeft}>
                <Paragraph style={styles.statTitle} text={`Today’s\n`} />
              </View>
              <View style={styles.statRight}>
                <Paragraph style={styles.statValue} text={`100`} />
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
                    onItemClick={handleItemClick}
                    key={index.toString()}
                    items={item}
                  />
                ))}
              </ScrollView>
            )}
          </View>

          {/* Bottom Bar */}
          <TouchableOpacity style={styles.bottomBar}>
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
