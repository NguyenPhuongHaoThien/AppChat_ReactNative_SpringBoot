// GeminiChatScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import GiftedChatApp from "../Components/GeminiChat";

const GeminiChatScreen = () => {
  return (
    <View style={styles.container}>
      <GiftedChatApp />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GeminiChatScreen;