// utils/toast.js
import Toast from 'react-native-toast-message';

export const ShowToast = (type, text1, text2) => {
  Toast.show({
    type,
    text1,
    text2,
    position: 'bottom',
    visibilityTime: 2500,
  });
};
