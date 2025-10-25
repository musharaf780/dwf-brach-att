import React from 'react';
import { Text, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { ThemeColors } from '../Constants/Color';

const Heading = (props) => {
  return (
    <Text style={[styles.heading, props.style]}>
      {props.title}
    </Text>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: hp('3.9%'),
    fontWeight: 'bold',
    color: ThemeColors.white,
    textAlign: 'center',
  },
});

export default Heading;
