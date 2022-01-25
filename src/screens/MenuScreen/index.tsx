import React from 'react';
import {StyleSheet, Text, View, SafeAreaView, Pressable} from 'react-native';
import {Auth} from 'aws-amplify';
import Button from '../../components/Button';

const MenuScreen = () => {
  const onLogout = () => {
    Auth.signOut();  // similar to firebase!
  };

  return (
    <SafeAreaView>
      <Button text="Sign out" onPress={onLogout} />
    </SafeAreaView>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({});
