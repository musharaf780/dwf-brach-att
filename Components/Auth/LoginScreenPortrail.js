import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Heading from '../Heading';
import Icon from 'react-native-vector-icons/Fontisto';
import AIcon from 'react-native-vector-icons/EvilIcons';
import IoIcon from 'react-native-vector-icons/Ionicons';
import AuthButton from '../AuthButton';
import { ThemeColors } from '../../Constants/Color';
import * as AuthAction from '../../Store/Actions/AuthAction';
import { useDispatch, useSelector } from 'react-redux';
import { showGlobalToast } from '../ToastManager';
import { ShowToast } from '../ShowToast';

const LoginScreenPortrail = props => {
  const { loader, loginSuccess, loginFail } = useSelector(state => state.auth);
  const [secure, setSecure] = useState(false);
  const dispatch = useDispatch();
  const [formfields, setFormfields] = useState({
    email: '',
    password: '',
  });

  const LoginHandler = () => {
    if (formfields.email === '') {
      ShowToast('error', 'Email Validation', 'Email Address is required');
    } else if (formfields.password === '') {
      ShowToast('error', 'Password Validation', 'Password Address is required');
    } else {
      dispatch(AuthAction.UserLoginAction(formfields));
    }
  };

  useEffect(() => {
    if (loginSuccess) {
      dispatch(
        AuthAction.GetEmployeeInformationAction(loginSuccess.access_token),
      );
      props.navigate();
    } else if (loginFail) {
      ShowToast(
        'error',
        'Credentials Error',
        'Oops! Something went wrong, please check your credentials',
      );
    }
  }, [loginSuccess, loginFail]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require('../../Assets/Images/loginvector.png')}
          />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.textWrapper}>
            <Heading title={`Sign in to your ${'\n'} Account`} />

            <View style={styles.inputBox}>
              <View style={styles.inputRow}>
                <View style={styles.iconWrapper}>
                  <Icon
                    name="email"
                    size={hp('2%')}
                    color={ThemeColors.black}
                  />
                </View>
                <View style={styles.textInputWrapper}>
                  <TextInput
                    value={formfields.email}
                    onChangeText={value => {
                      setFormfields({
                        ...formfields,
                        email: value,
                      });
                    }}
                    style={styles.textInput}
                    placeholderTextColor={ThemeColors.light}
                    placeholder="Email here"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.iconWrapper}>
                  <AIcon
                    name="lock"
                    size={hp('3%')}
                    color={ThemeColors.black}
                  />
                </View>
                <View style={styles.textInputWrapperPassword}>
                  <TextInput
                    value={formfields.password}
                    onChangeText={value => {
                      setFormfields({
                        ...formfields,
                        password: value,
                      });
                    }}
                    secureTextEntry={!secure}
                    style={styles.textInput}
                    placeholderTextColor={ThemeColors.light}
                    placeholder="Password here"
                  />
                </View>
                <TouchableOpacity
                  onPress={() => setSecure(!secure)}
                  style={styles.eyeIconWrapper}
                >
                  <IoIcon
                    name={secure ? 'eye-off-outline' : 'eye-outline'}
                    size={hp('2.2%')}
                    color={'gray'}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <AuthButton
              loading={loader}
              onPress={LoginHandler}
              // onPress={() => {
              //   props.navigation.replace('DashboardScreen');
              // }}
              style={styles.button}
              text="Log In"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: hp('5%'),
  },
  imageContainer: {
    height: hp('40%'),
    width: wp('100%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: hp('35%'),
    width: wp('90%'),
    resizeMode: 'contain',
  },
  contentContainer: {
    width: wp('100%'),
  },
  textWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('100%'),
  },
  inputBox: {
    height: hp('10%'),
    width: wp('90%'),
    backgroundColor: 'white',
    marginVertical: hp('2%'),
    borderRadius: hp('1%'),
    overflow: 'hidden',
  },
  inputRow: {
    height: '50%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'lightgray',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconWrapper: {
    width: '10%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputWrapper: {
    width: '85%',
    height: '100%',
    justifyContent: 'center',
  },
  textInputWrapperPassword: {
    width: '75%',
    height: '100%',
    justifyContent: 'center',
  },
  textInput: {
    height: '100%',
    width: '100%',
    fontSize: hp('1.6%'),
    color: ThemeColors.black,
  },
  eyeIconWrapper: {
    width: '20%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: hp('2%'),
  },
});

export default LoginScreenPortrail;
