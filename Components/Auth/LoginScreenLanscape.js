import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Button,
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
import * as AuthAction from '../../Store /Actions/AuthAction';
import { useDispatch, useSelector } from 'react-redux';
import { getAuthData } from '../../DB/AuthDatabse';
import { showGlobalToast } from '../ToastManager';
const LoginScreenLandscape = props => {
  const { loader, loginSuccess, loginFail } = useSelector(state => state.auth);
  const [secure, setSecure] = useState(false);
  const dispatch = useDispatch();
  const [formfields, setFormfields] = useState({
    email: 'dammamroad@juicetime.com.sa',
    password: '1',
  });

  const LoginHandler = () => {
    if (formfields.email === '') {
      showGlobalToast('Email is required', 'error');
    } else if (formfields.password === '') {
      showGlobalToast('Password is required', 'error');
    } else {
      dispatch(AuthAction.UserLoginAction(formfields));
    }
  };

  useEffect(() => {
    if (loginSuccess) {
      props.navigate();
    }else if(loginFail){
      showGlobalToast('Oops! Something went wrong', 'error');
    }
  }, [loginSuccess, loginFail]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.rowContainer}>
        {/* Left Side - Image */}
        <View style={styles.leftContainer}>
          <Image
            style={styles.image}
            source={require('../../Assets/Images/loginvector.png')}
          />
        </View>

        {/* Right Side - Form */}
        <View style={styles.rightContainer}>
          <View style={styles.textWrapper}>
            <Heading title={`Sign in to your\nAccount`} />

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
              testStyle={{ fontSize: hp('2%') }}
              loading={loader}
              onPress={LoginHandler}
              style={styles.button}
              text="Log In"
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  leftContainer: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ThemeColors.secondary,
  },
  rightContainer: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
  },
  image: {
    height: hp('70%'),
    width: wp('40%'),
    resizeMode: 'contain',
  },
  textWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  inputBox: {
    width: '100%',
    backgroundColor: 'white',
    marginVertical: hp('2%'),
    borderRadius: hp('1%'),
    overflow: 'hidden',
  },
  inputRow: {
    height: hp('6%'),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'lightgray',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconWrapper: {
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputWrapper: {
    width: '85%',
    justifyContent: 'center',
  },
  textInputWrapperPassword: {
    width: '75%',
    justifyContent: 'center',
  },
  textInput: {
    fontSize: hp('1.8%'),
    color: ThemeColors.black,
  },
  eyeIconWrapper: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    height: hp('7%'),
    marginTop: hp('2%'),
    width: '100%',
  },
});

export default LoginScreenLandscape;
