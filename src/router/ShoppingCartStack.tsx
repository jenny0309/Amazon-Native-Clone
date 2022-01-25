import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

import ShoppingCartScreen from '../screens/ShoppingCartScreen';
import AddressScreen from '../screens/AddressScreen';

const Stack = createStackNavigator();

const ShoppingCartStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen component={ShoppingCartScreen} name="ShoppingCartScreen" />
      <Stack.Screen component={AddressScreen} name="AddressScreen" />
    </Stack.Navigator>
  );
};

export default ShoppingCartStack;

const styles = StyleSheet.create({});
