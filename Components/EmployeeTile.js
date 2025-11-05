import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import IoIcon from 'react-native-vector-icons/Ionicons';
import { ThemeColors } from '../Constants/Color';
import Heading from './Heading';
import Paragraph from './Paragraph';

const EmployeeTile = ({ items, onItemClick }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {items?.image ? (
          <Image
            style={{
              width: '80%',
              height: '100%',

              resizeMode: 'contain',
            }}
            source={{ uri: items?.image }}
          />
        ) : (
          <IoIcon
            size={hp('5%')}
            color={ThemeColors.primary}
            name="person-sharp"
          />
        )}
      </View>

      <View style={styles.detailsContainer}>
        <Heading style={styles.name} title={items?.name} />

        <TouchableOpacity
          onPress={() => onItemClick(items?.image)}
          activeOpacity={0.8}
          style={[
            styles.button,
            {
              backgroundColor: items.checkIn
                ? ThemeColors.danger
                : ThemeColors.success,
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
              text={items.checkIn ? 'Check Out' : 'Check In'}
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
    width: '100%',
    backgroundColor: ThemeColors.white,
    marginTop: hp('1.5%'),
    borderRadius: hp('1%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp('3%'),
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
    marginRight: hp('1.5%'),
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
    height: hp('4%'),
    width: wp('32%'),
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
    fontSize: hp('1.6%'),
  },
});

export default EmployeeTile;
