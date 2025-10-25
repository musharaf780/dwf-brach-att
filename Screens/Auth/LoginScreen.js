import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Heading from '../../Components/Heading';
import Icon from 'react-native-vector-icons/Fontisto';
import AIcon from 'react-native-vector-icons/EvilIcons';
import IoIcon from 'react-native-vector-icons/Ionicons';
import AuthButton from '../../Components/AuthButton';
import { ThemeColors } from '../../Constants/Color';

const LoginScreen = () => {
  const [secure, setSecure] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require('../../Assets/Images/loginvector.png')}
        />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.textWrapper}>
          <Heading title={`Sign in to your ${'\n'} Account`} />

          <View
            style={{
              height: hp('10%'),
              width: wp('90%'),
              backgroundColor: 'white',
              marginBottom: hp('1%'),
              marginTop: hp('2%'),
              borderRadius: hp('1%'),
            }}
          >
            <View
              style={{
                height: '50%',
                width: '100%',

                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomColor: 'lightgray',
                borderBottomWidth: hp(0.05),
              }}
            >
              <View
                style={{
                  width: '15%',
                  height: '100%',

                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Icon name="email" size={hp('2%')} color={ThemeColors.black} />
              </View>
              <View
                style={{
                  width: '85%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <TextInput
                  style={{
                    height: '100%',
                    width: '100%',
                    fontSize: hp('1.5%'),
                    color: ThemeColors.black,
                  }}
                  placeholderTextColor={ThemeColors.light}
                  placeholder="Email here"
                />
              </View>
            </View>

            <View
              style={{
                height: '50%',
                width: '100%',

                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: '15%',
                  height: '100%',

                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <AIcon name="lock" size={hp('3%')} color={ThemeColors.black} />
              </View>
              <View
                style={{
                  width: '75%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <TextInput
                  secureTextEntry={secure}
                  style={{
                    height: '100%',
                    width: '100%',
                    fontSize: hp('1.5%'),
                    color: ThemeColors.black,
                  }}
                  placeholderTextColor={ThemeColors.light}
                  placeholder="Password here"
                />
              </View>
              <TouchableOpacity
                onPress={() => setSecure(!secure)}
                style={{
                  height: '100%',
                  width: '10%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <IoIcon name="eye-outline" size={hp('2%')} color={'gray'} />
              </TouchableOpacity>
            </View>
          </View>
          <AuthButton style={styles.button} text="Log In" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    height: hp('60%'),
    width: wp('100%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: hp('35%'),
    width: wp('100%'),
    resizeMode: 'contain',
  },
  contentContainer: {
    height: hp('40%'),
    width: wp('100%'),
  },
  textWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('100%'),
  },
  paragraph: {
    marginVertical: hp('1%'),
    textAlign: 'center',
  },
  button: {
    marginTop: hp('2%'),
  },
});

export default LoginScreen;
