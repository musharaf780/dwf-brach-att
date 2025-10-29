import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import IoIcon from 'react-native-vector-icons/Ionicons';
import { ThemeColors } from '../Constants/Color';
import Heading from './Heading';
import Paragraph from './Paragraph';

const EmployyeTileLandscape = ({ items }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <IoIcon
          size={hp('5%')}
          color={ThemeColors.primary}
          name="person-sharp"
        />
      </View>

      <View style={styles.detailsContainer}>
        <Heading style={styles.name} title={items.Name} />
        <Paragraph
          style={styles.dateText}
          text={new Date(items?.dateandtime).toLocaleString()}
        />

        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.button,
            {
              backgroundColor: items.isCheckIn
                ? ThemeColors.success
                : ThemeColors.danger,
            },
          ]}
        >
          <View style={styles.buttonIcon}>
            <IoIcon
              size={hp('2%')}
              color={ThemeColors.white}
              name="calendar-clear-outline"
            />
          </View>
          <View style={styles.buttonLabel}>
            <Paragraph
              style={styles.buttonText}
              text={items.isCheckIn ? 'Check In' : 'Check Out'}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: hp('13%'),
    width: '100%', // keep 100% so it fills its parent wrapper (48%)
    backgroundColor: ThemeColors.white,
    borderRadius: hp('1%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '2%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    height: '100%',
    width: '18%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    flex: 1,
    paddingVertical: hp('0.5%'),
  },
  name: {
    color: ThemeColors.black,
    fontSize: hp('2%'),
    textAlign: 'left',
  },
  dateText: {
    color: ThemeColors.light,
    fontSize: hp('1.5%'),
    marginTop: hp('0.3%'),
  },
  button: {
    height: hp('5%'),
    width: '50%',
    borderRadius: hp('1%'),
    marginTop: hp('0.5%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLabel: {
    width: '75%',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    color: ThemeColors.white,
    fontSize: hp('2'),
  },
});

export default EmployyeTileLandscape;
