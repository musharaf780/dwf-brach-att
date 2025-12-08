import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Paragraph from './Paragraph';
import { ThemeColors } from '../Constants/Color';
import Heading from './Heading';
import { useSelector } from 'react-redux';

const PushRecordsToServerModal = ({ visible }) => {
  const { isTablet } = useSelector(state => state.auth);

  if (!visible) return null;

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        zIndex: 9999,
      }}
    >
      <View style={styles.backdrop}>
        <View
          style={[
            styles.container,
            {
              height: isTablet ? hp('30%') : hp('15%'),
              justifyContent: 'center',
            },
          ]}
        >
          <View style={{ marginBottom: hp('3%'), alignItems: 'center' }}>
            <Heading
              style={isTablet ? styles.branchTextTablet : styles.branchText}
              title="RECORDS PUSH TO SERVER"
            />

            <Paragraph
              style={{
                color: ThemeColors.primary,
                textAlign: 'center',
                fontSize: isTablet ? hp('3%') : hp('1.5%'),
              }}
              text="Please wait until records are pushed to the server."
            />
          </View>

          {/* Simple Loader */}
          <ActivityIndicator
            size={isTablet ? 'large' : 'small'}
            color={ThemeColors.primary}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('5%'),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    height: hp('15%'),
  },
  branchText: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: ThemeColors.primary,
  },
  branchTextTablet: {
    fontSize: hp('5%'),
    fontWeight: 'bold',
    color: ThemeColors.primary,
  },
});

export default PushRecordsToServerModal;
