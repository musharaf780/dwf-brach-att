import React, { useRef, useEffect } from 'react';
import { View, Modal, Animated, StyleSheet } from 'react-native';
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
  const slideAnim = useRef(new Animated.Value(300)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide in/out animation
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : 300,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Looping horizontal loading bar
    if (visible) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(progressAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: false,
          }),
          Animated.timing(progressAnim, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: false,
          }),
        ]),
      ).start();
    } else {
      progressAnim.stopAnimation();
    }
  }, [visible]);

  const widthInterpolate = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <>
      {visible && (
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
            <Animated.View
              style={[
                styles.container,
                {
                  transform: [{ translateY: slideAnim }],
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

              <View style={styles.barBackground}>
                <Animated.View
                  style={[styles.barFill, { width: widthInterpolate }]}
                />
              </View>
            </Animated.View>
          </View>
        </View>
      )}
    </>
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
  barBackground: {
    width: '100%',
    height: hp('1%'),
    borderRadius: 5,
    backgroundColor: '#eee',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: ThemeColors.primary,
  },
});

export default PushRecordsToServerModal;
