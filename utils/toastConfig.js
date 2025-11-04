import React from 'react';
import { BaseToast, ErrorToast } from 'react-native-toast-message';

export const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        width: '90%', // 👈 set width here
        alignSelf: 'center', // center it horizontally
        borderLeftColor: '#16a34a',
        backgroundColor: '#ecfdf5',
        borderRadius: 12,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 16, fontWeight: '600', color: '#166534' }}
      text2Style={{ fontSize: 14, color: '#15803d' }}
    />
  ),

  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        width: '90%', // 👈 width adjustment applies here too
        alignSelf: 'center',
        borderLeftColor: '#dc2626',
        backgroundColor: '#fef2f2',
        borderRadius: 12,
      }}
      text1Style={{ fontSize: 16, fontWeight: '600', color: '#991b1b' }}
      text2Style={{ fontSize: 14, color: '#b91c1c' }}
    />
  ),
};
