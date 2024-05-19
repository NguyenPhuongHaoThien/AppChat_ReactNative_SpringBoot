// Components/ChatIcon.js
import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GeminiChat from './GeminiChat';

const ChatIcon = () => {
  const [showChat, setShowChat] = useState(false);

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  return (
    <>
      <TouchableOpacity style={styles.iconContainer} onPress={toggleChat}>
        <Ionicons name="chatbubbles" size={32} color="#0084ff" />
      </TouchableOpacity>
      {showChat && <GeminiChat onClose={toggleChat} />}
    </>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default ChatIcon;