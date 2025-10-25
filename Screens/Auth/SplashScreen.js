import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Heading from '../../Components/Heading';
import Paragraph from '../../Components/Paragraph';
const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <View
        style={{
          height: hp('60%'),
          width: wp('100%'),

          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          style={{
            height: hp('40%'),
            width: wp('100%'),
            resizeMode: 'contain',
          }}
          source={require('../../Assets/Images/splash.png')}
        />
      </View>
      <View
        style={{
          height: hp('40%'),
          width: wp('100%'),
        }}
      >
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: wp('100%'),
          }}
        >
          <Heading title="Welcome to The HR Application" />
          <Paragraph
            style={{ margin: hp('2%'), textAlign: 'center' }}
            text="Connect securely with potential candidates and employers through our HR application."
          />
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1 },
});
export default SplashScreen;
