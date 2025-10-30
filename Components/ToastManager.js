// Components/ToastManager.js
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Animated, StyleSheet, Text, Dimensions } from 'react-native';
import { ThemeColors } from '../Constants/Color';

const ToastContext = createContext();
const { width } = Dimensions.get('window');
let globalShowToast = null;

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success',
  });
  const opacity = useRef(new Animated.Value(0)).current;

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setToast({ visible: false, message: '', type }));
    }, 2500);
  };

  useEffect(() => {
    globalShowToast = showToast;
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.visible && (
        <Animated.View
          style={[
            styles.toastContainer,
            {
              opacity,
              backgroundColor: toast.type === 'success' ? '#4CAF50' : '#E53935',
              width: '10%',
            },
          ]}
        >
          <Text style={styles.toastText}>{toast.message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

export const showGlobalToast = (message, type = 'success') => {
  if (globalShowToast) globalShowToast(message, type);
  else console.log('ToastProvider not mounted yet');
};

export const useToast = () => useContext(ToastContext);

const styles = StyleSheet.create({
  toastContainer: {
    width: '10%',
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 9999,
    minWidth: width * 0.2,
    padding: '2%',
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toastText: {
    color: ThemeColors.secondary,
    fontWeight: '600',
  },
});
