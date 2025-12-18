import React from 'react';
import { Modal, View, StyleSheet, Platform, Linking } from 'react-native';
import AuthButton from './AuthButton';
import { ThemeColors } from '../Constants/Color';
import Paragraph from './Paragraph';

const UpdateAppMopup = ({ visible = true }) => {
  const openUrl = (androidurl, iosurl) => {
    Platform.OS === 'ios'
      ? Linking.canOpenURL(iosurl).then(
          supported => {
            supported && Linking.openURL(iosurl);
          },
          err => console.log(err),
        )
      : Linking.openURL(androidurl).catch(err => console.error('Error', err));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Paragraph
            style={styles.text}
            text="We released a new build. You need to update the application before proceeding."
          />

          <AuthButton
            onPress={async () => {
              setTimeout(() => {
                openUrl(
                  'https://play.google.com/store/apps/details?id=com.dwfbranchatt',
                  'https://apps.apple.com/us/app/dwf/id6444727285',
                );
              }, 2000);
            }}
            testStyle={{ color: ThemeColors.white }}
            style={styles.button}
            text="UPDATE APP"
          />
        </View>
      </View>
    </Modal>
  );
};

export default UpdateAppMopup;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '5%',
  },
  card: {
    width: '100%',
    backgroundColor: ThemeColors.white,
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  text: {
    color: ThemeColors.black,
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: ThemeColors.primary,
    width: '80%',
  },
});
