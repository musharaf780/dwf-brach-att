import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import { ThemeColors } from '../../../Constants/Color';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const UserPendingShiftPortrait = props => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={Platform.OS === 'ios' ? 'light-content' : 'light-content'}
      />
      <View
        style={{
          height: '10%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={props.onGoBack}
          style={{
            position: 'absolute',
            left: hp(2),
          }}
        >
          <Text
            style={{
              fontSize: hp('3'),
              fontWeight: '600',
              color: '#fff',
              bottom: hp(0.4),
            }}
          >
            ←
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            fontSize: hp('2'),
            fontWeight: '600',
            color: '#fff',
          }}
        >
          All Pending Shifts
        </Text>
      </View>
      <View
        style={{
          height: '90%',
          width: '100%',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          padding: hp('2.5%'),
          paddingBottom: hp('5%'),
          borderTopLeftRadius: hp('5%'),
          borderTopRightRadius: hp('5%'),
        }}
      >
        <View style={{ height: '100%', width: '100%' }}></View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ThemeColors.primary,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
export default UserPendingShiftPortrait;
