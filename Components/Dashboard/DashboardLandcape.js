import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { ThemeColors } from '../../Constants/Color';
import IoIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Data } from '../../Constants/Data';
import Paragraph from '../Paragraph';
import EmployyeTileLandscape from '../EmployyeTileLandscape';


const DashboardLandcape = props => {


  const SearchTile = () => (
    <View style={styles.searchTileContainer}>
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

  return (
    <View style={styles.mainContainer}>
      {/* Left Sidebar */}
      <View style={styles.sidebarContainer}>
        <View style={styles.logoWrapper}>
          <Image source={require('../../Assets/Images/dwflogo.jpg')} />
        </View>

        <View style={styles.welcomeWrapper}>
          <Paragraph style={styles.welcomeText} text="Welcome," />
          <Paragraph style={styles.branchText} text="Dammam Road Branch" />
        </View>

        <View style={styles.statsContainer}>
          {/* Pending Shift */}
          <View style={styles.statBox}>
            <Paragraph style={styles.statPendingTitle} text="Pending Shift" />
            <Paragraph style={styles.statPendingValue} text="10" />
          </View>

          {/* Pushed Shift */}
          <View style={styles.statBoxAlt}>
            <Paragraph style={styles.statPushedTitle} text="Pushed Shift" />
            <Paragraph style={styles.statPushedValue} text="200" />
          </View>
        </View>

        {/* Sync + Logout */}
        <View style={styles.footerButtonsContainer}>
          <TouchableOpacity style={styles.footerButton}>
            <MaterialIcons
              name="sync"
              size={hp('3%')}
              color={ThemeColors.white}
            />
            <Paragraph
              style={styles.footerButtonText}
              text="Sync Employee List"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={props.logoutPress}
            style={styles.footerButton}
          >
            <MaterialIcons
              name="logout"
              size={hp('3%')}
              color={ThemeColors.white}
            />
            <Paragraph style={styles.footerButtonText} text="Logout" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Right Content */}
      <View style={styles.rightContainer}>
        <View style={styles.searchContainer}>
          <SearchTile />
        </View>

        <View style={styles.employeeContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.employeeScroll}
          >
            {Data.map((item, index) => (
              <View key={index.toString()} style={styles.employeeTile}>
                <EmployyeTileLandscape items={item} />
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.bottomBar}>
            <MaterialIcons
              name="fact-check"
              color={ThemeColors.secondary}
              size={hp('5%')}
            />
            <Paragraph
              style={styles.bottomBarText}
              text="Push Records to the server"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    width: '100%',
    flexDirection: 'row',
  },
  sidebarContainer: {
    height: '100%',
    width: '25%',
    backgroundColor: ThemeColors.primary,
  },
  logoWrapper: {
    height: '15%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  welcomeWrapper: {
    paddingHorizontal: '2%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: hp('2%'),
    color: ThemeColors.secondary,
  },
  branchText: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    color: ThemeColors.secondary,
  },
  statsContainer: {
    height: '50%',
    width: '100%',
    alignItems: 'center',
    marginTop: hp('1%'),
  },
  statBox: {
    height: hp('8%'),
    width: '90%',
    backgroundColor: ThemeColors.secondary,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: hp('2%'),
    borderRadius: hp('1%'),
  },
  statPendingTitle: {
    color: ThemeColors.primary,
    fontWeight: 'bold',
    fontSize: hp('2.2%'),
  },
  statPendingValue: {
    color: ThemeColors.primary,
    fontSize: hp('3%'),
    fontWeight: 'bold',
  },
  statBoxAlt: {
    height: hp('8%'),
    width: '90%',
    backgroundColor: ThemeColors.secondary,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: hp('2%'),
    borderRadius: hp('1%'),
    marginTop: hp('1.5%'),
  },
  statPushedTitle: {
    color: ThemeColors.primary,
    fontWeight: 'bold',
    fontSize: hp('2.2%'),
  },
  statPushedValue: {
    color: ThemeColors.primary,
    fontSize: hp('3%'),
    fontWeight: 'bold',
  },
  footerButtonsContainer: {
    height: '20%',
    width: '100%',
    paddingHorizontal: hp('2%'),
    justifyContent: 'center',
  },
  footerButton: {
    height: hp('6%'),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: hp('1%'),
    marginBottom: hp('1.5%'),
    paddingHorizontal: hp('1.5%'),
  },
  footerButtonText: {
    marginLeft: hp('1%'),
    color: ThemeColors.secondary,
    fontWeight: 'bold',
    fontSize: hp('1.9%'),
  },
  rightContainer: {
    height: '100%',
    width: '75%',
    backgroundColor: ThemeColors.secondary,
    borderTopLeftRadius: '2%',
    borderBottomLeftRadius: '2%',
  },
  searchContainer: {
    height: '15%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchTileContainer: {
    flexDirection: 'row',
    width: '90%',
    backgroundColor: ThemeColors.white,
    height: '40%',
    paddingHorizontal: hp('2%'),
    borderRadius: '2%',
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
  employeeContainer: {
    height: '70%',
    width: '100%',
    paddingHorizontal: '5%',
  },
  employeeScroll: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  employeeTile: {
    width: '48%',
    marginBottom: 10,
  },
  bottomContainer: {
    height: '10%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    height: '80%',
    width: '80%',
    backgroundColor: ThemeColors.primary,
    borderRadius: hp('1%'),
    marginTop: hp('2%'),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBarText: {
    marginLeft: hp('1%'),
    fontWeight: '600',
    color: ThemeColors.white,
    fontSize: hp('2.5%'),
  },
});

export default DashboardLandcape;
