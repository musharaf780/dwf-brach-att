import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Heading from '../../Components/Heading';
import Paragraph from '../../Components/Paragraph';
import AuthButton from '../../Components/AuthButton';

const LoginScreen = () => {
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
