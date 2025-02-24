// App.js
import React from 'react';
import { Provider } from 'react-redux';
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Slot } from 'expo-router';  // To render the current screen
import store from './store';  // Correct path to your store

const App = () => {
  return (
    <Provider store={store}>  {/* Wrap the entire app with the Redux Provider */}
      {/* <Slot />  expo-router renders the current screen */}
      <Text>HIII</Text>
    </Provider>
  );
};

export default App;
