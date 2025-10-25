import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import MainNavigator from './Nvigation/MianNavigator';
import { initDB } from './DB/Database';

const App = () => {
  useEffect(() => {
    initDB();
  }, []);

  return <MainNavigator />;
};

export default App;
