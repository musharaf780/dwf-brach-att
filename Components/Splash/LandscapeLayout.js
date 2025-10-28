import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Heading from '../Heading';
import Paragraph from '../Paragraph';
import AuthButton from '../AuthButton';

const LandscapeLayout = props => {
  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <View
        style={{
          height: '100%',
          width: '50%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          style={styles.image}
          source={require('../../Assets/Images/splash.png')}
        />
      </View>

      <View
        style={{
          height: '100%',
          width: '50%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View style={{ width: '90%' }}>
          <Heading
            style={{ fontSize: hp('6%') }}
            title="Welcome to The HR Application"
          />
          <Paragraph
            style={styles.paragraph}
            text="Connect securely with potential candidates and employers through our HR application."
          />
          <AuthButton
            testStyle={{ fontSize: hp('2%') }}
            onPress={props.onNavigate}
            style={styles.button}
            text="Continue"
          />
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
    height: hp('45%'),
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
    paddingHorizontal: hp('2%'),
    fontSize: hp('2%'),
  },
  button: {
    height: hp('7%'),
    marginTop: hp('2%'),
    width: '100%',
  },
});

export default LandscapeLayout;
