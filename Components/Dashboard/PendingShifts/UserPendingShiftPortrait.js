import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { ThemeColors } from '../../../Constants/Color';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { getUnpushedRecords } from '../../../DB/EmployeePendingShift';
import { Button } from 'react-native';
import Paragraph from '../../Paragraph';

const UserPendingShiftPortrait = props => {
  const [pendingShifts, setPendingShifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const GetAllPending = () => {
    setLoading(true);
    getUnpushedRecords(
      records => {
        setPendingShifts(records);
        setLoading(false);
      },
      err => setLoading(false),
    );
  };
  useEffect(() => {
    GetAllPending();
  }, []);

  const formatDateTime = isoString => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString(); // Example: "12/16/2025, 5:30:41 PM"
  };

  const attachmentToBase64Image = attachment => {
    try {
      if (!attachment) return null;

      const parsed =
        typeof attachment === 'string' ? JSON.parse(attachment) : attachment;

      if (!parsed?.datas) return null;

      return `data:image/jpeg;base64,${parsed.datas}`;
    } catch {
      return null;
    }
  };

  const PendingListTile = ({ item }) => {
    return (
      <View
        style={{
          height: hp(10),
          width: '100%',
          backgroundColor: ThemeColors.white,
          marginBottom: hp(2),
          borderRadius: hp(1),
          padding: hp(1),
        }}
      >
        <View
          style={{
            height: '100%',
            width: '100%',

            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: hp(1),
          }}
        >
          <View
            style={{
              height: '90%',
              width: '20%',
              backgroundColor: ThemeColors.white,
              borderRadius: hp(1),
            }}
          >
            <Image
              style={{ height: '100%', width: '100%', resizeMode: 'contain' }}
              src={attachmentToBase64Image(item.attachment)}
            />
          </View>

          <View
            style={{
              height: '70%',
              width: '75%',
            }}
          >
            <Paragraph
              style={{
                fontSize: hp(2),
                color: ThemeColors.black,
                fontWeight: 'bold',
              }}
              text="Musharaf Ahmed"
            />

            <Paragraph
              style={{
                color: ThemeColors.black,
                fontSize: hp(1.2),
              }}
              text={formatDateTime(item.loc_date)}
            />
            <Paragraph
              style={{
                color:
                  item.api_call_for === 'checkout'
                    ? ThemeColors.danger
                    : ThemeColors.success,
                fontWeight: 'bold',
              }}
              text={item.api_call_for}
            />
          </View>
        </View>
      </View>
    );
  };
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
          backgroundColor: ThemeColors.secondary,
          padding: hp('2.5%'),
          paddingBottom: hp('5%'),
          borderTopLeftRadius: hp('5%'),
          borderTopRightRadius: hp('5%'),
        }}
      >
        <View style={{ height: '100%', width: '100%' }}>
          <FlatList
            ListEmptyComponent={() => {
              return (
                <View
                  style={{
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <ActivityIndicator
                    size={'large'}
                    color={ThemeColors.primary}
                  />
                </View>
              );
            }}
            data={pendingShifts}
            renderItem={itemData => {
              return <PendingListTile item={itemData.item} />;
            }}
          />
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
});
export default UserPendingShiftPortrait;
