import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { ThemeColors } from '../Constants/Color';
import IoIcon from 'react-native-vector-icons/Ionicons';
import { Data } from '../Constants/Data';
import EmployeeTile from '../Components/EmployeeTile';

const DashboardScreen = props => {
  const SearchTile = () => {
    return (
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search"
          placeholderTextColor={ThemeColors.light}
          style={styles.searchInput}
        />
        <TouchableOpacity style={styles.searchIcon}>
          <IoIcon
            size={hp('2.2%')}
            name="search-outline"
            color={ThemeColors.light}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.headerSection}></View>

        {/* Main Content Section */}
        <View style={styles.contentSection}>
          <View style={styles.innerContainer}>
            <SearchTile />

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: hp('1%') }}
            >
              {Data.map((item, index) => {
                return <EmployeeTile key={index.toString()} items={item} />;
              })}
            </ScrollView>
          </View>

          {/* Bottom Bar */}
          <View style={styles.bottomBar}></View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerSection: {
    height: hp('25%'),
    width: wp('100%'),
    backgroundColor: ThemeColors.primary || '#f5f5f5',
  },
  contentSection: {
    flex: 1,
    backgroundColor: ThemeColors.secondary,
    borderTopRightRadius: hp('4%'),
    borderTopLeftRadius: hp('4%'),
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp('2%'),
  },
  innerContainer: {
    height: '85%',
    width: '90%',
  },
  searchContainer: {
    height: hp('5%'),
    width: '100%',
    backgroundColor: 'white',
    borderRadius: hp('1%'),
    borderColor: ThemeColors.light,
    borderWidth: hp('0.08%'),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: hp('1.5%'),
  },
  searchInput: {
    flex: 1,
    color: ThemeColors.black,
    fontSize: hp('1.6%'),
  },
  searchIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: hp('0.5%'),
  },
  employeeCard: {
    backgroundColor: 'white',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: hp('2%'),
    borderRadius: hp('1%'),
    marginVertical: hp('0.6%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  employeeName: {
    fontSize: hp('1.8%'),
    color: ThemeColors.black,
  },
  bottomBar: {
    height: hp('7%'),
    width: '90%',
    backgroundColor: ThemeColors.primary || 'green',
    borderRadius: hp('1%'),
    marginTop: hp('2%'),
  },
});

export default DashboardScreen;
