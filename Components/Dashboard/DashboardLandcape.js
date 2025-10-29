import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  SafeAreaView,
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
import EmployeeTile from '../EmployeeTile';
import Paragraph from '../Paragraph';

const DashboardLandcape = props => {
  const SearchTile = () => (
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={Platform.OS === 'ios' ? 'light-content' : 'light-content'}
      />

      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.topRow}>
            <View style={styles.logoContainer}>
              <Image
                style={styles.logoImage}
                source={require('../../Assets/Images/dwflogo.jpg')}
              />
            </View>

            <View style={styles.welcomeContainer}>
              <View style={styles.welcomeInner}>
                <Paragraph style={styles.welcomeText} text="Welcome," />
                <Paragraph
                  style={styles.branchText}
                  text="Dammam Road Branch"
                />
              </View>
            </View>

            {/* Action Icons */}
            <View style={styles.iconContainer}>
              <TouchableOpacity style={styles.iconButton}>
                <MaterialIcons
                  name="sync"
                  size={hp('2.3%')}
                  color={ThemeColors.white}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <MaterialIcons
                  name="logout"
                  size={hp('2.3%')}
                  color={ThemeColors.white}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={styles.statLeft}>
                <Paragraph style={styles.statTitle} text={`Pending\nShift`} />
              </View>
              <View style={styles.statRight}>
                <Paragraph style={styles.statValue} text={`30`} />
              </View>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statLeft}>
                <Paragraph style={styles.statTitle} text={`Pushed\nShift`} />
              </View>
              <View style={styles.statRight}>
                <Paragraph style={styles.statValue} text={`100`} />
              </View>
            </View>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <View style={styles.innerContainer}>
            <SearchTile />

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {Data.map((item, index) => (
                <EmployeeTile key={index.toString()} items={item} />
              ))}
            </ScrollView>
          </View>

          {/* Bottom Bar */}
          <TouchableOpacity style={styles.bottomBar}>
            <MaterialIcons
              name="fact-check"
              color={ThemeColors.secondary}
              size={hp('3%')}
            />
            <Paragraph
              style={styles.bottomBarText}
              text="Push Records to the server"
            />
          </TouchableOpacity>
        </View>
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
  container: {
    flex: 1,
  },
  headerContainer: {
    height: hp('20%'),
    width: wp('100%'),
  },
  topRow: {
    height: '50%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    height: hp('15%'),
    width: wp('15%'),
    resizeMode: 'center',
  },
  welcomeContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeInner: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  welcomeText: {
    fontSize: hp('1.7%'),
  },
  branchText: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
  },
  iconContainer: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconButton: {
    padding: hp('0.5%'),
  },
  statsRow: {
    height: '50%',
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: wp('5%'),
    justifyContent: 'space-between',
  },
  statCard: {
    height: hp('8%'),
    width: wp('42%'),
    borderRadius: hp('1%'),
    borderWidth: 1,
    borderColor: ThemeColors.secondary,
    padding: hp('1%'),
    justifyContent: 'space-between',
  },
  statLeft: {
    alignSelf: 'flex-start',
  },
  statRight: {
    alignSelf: 'flex-end',
  },
  statTitle: {
    fontWeight: 'bold',
    color: ThemeColors.secondary,
    fontSize: hp('2%'),
  },
  statValue: {
    color: ThemeColors.secondary,
    fontWeight: 'bold',
    fontSize: hp('2%'),
  },
  contentSection: {
    flex: 1,
    backgroundColor: ThemeColors.secondary,
    borderTopRightRadius: hp('4%'),
    borderTopLeftRadius: hp('4%'),
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp('2%'),
    paddingBottom: Platform.OS === 'android' ? hp('4.5%') : hp('1%'),
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
  scrollContent: {
    paddingVertical: hp('1%'),
  },
  bottomBar: {
    height: hp('5%'),
    width: '90%',
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
    fontSize: hp('1.7%'),
  },
});

export default DashboardLandcape;
