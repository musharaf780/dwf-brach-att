import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { ThemeColors } from '../Constants/Color';
import Paragraph from './Paragraph';

const AuthButton = props => {
  return (
    <TouchableOpacity
    
      disabled={props.loading}
      onPress={props.onPress}
      style={{
        height: hp('5%'),
        width: wp('90%'),
        backgroundColor: ThemeColors.white,
        borderRadius: hp('0.6%'),
        justifyContent: 'center',
        alignItems: 'center',
        ...props.style,
      }}
    >
      {props.loading && (
        <ActivityIndicator size={'large'} color={ThemeColors.primary} />
      )}
      {!props.loading && (
        <Paragraph
          text={props.text}
          style={{
            color: ThemeColors.primary,
            fontWeight: '600',
            ...props.testStyle,
          }}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});

export default AuthButton;
