import React from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { ThemeColors } from '../../../Constants/Color';
import Heading from '../../Heading';
import AuthButton from '../../AuthButton';

const CameraPopupPortrait = ({ visible, onCapture, children }) => {
  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Heading style={styles.heading} title="Capture Image" />
          </View>

          <View style={styles.content}>{children}</View>

          <View style={styles.footer}>
            <AuthButton
              text="Capture"
              style={styles.captureButton}
              testStyle={{ color: ThemeColors.secondary }}
              onPress={onCapture}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    height: hp('60%'),
    width: wp('80%'),
    backgroundColor: ThemeColors.secondary,
    borderRadius: wp('5%'),
    overflow: 'hidden',
  },
  header: {
    height: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: hp('3%'),
    color: ThemeColors.primary,
  },
  content: {
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
  },
  footer: {
    height: '15%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: hp('2%'),
  },
  captureButton: {
    width: '90%',
    backgroundColor: ThemeColors.primary,
  },
});

export default CameraPopupPortrait;
