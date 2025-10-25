import React from 'react';
import { Text, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { ThemeColors } from '../Constants/Color';

const Paragraph = props => {
  return <Text style={[styles.paragraph, props.style]}>{props.text}</Text>;
};

const styles = StyleSheet.create({
  paragraph: {
    fontSize: hp('1.48%'), // equivalent to ~12px
    color: ThemeColors.white,
    lineHeight: hp('2%'), // added for better readability
  },
});

export default Paragraph;
