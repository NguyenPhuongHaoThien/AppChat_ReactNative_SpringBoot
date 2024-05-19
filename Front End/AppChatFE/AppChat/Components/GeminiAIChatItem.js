// GeminiAIChatItem.js
import React from 'react';
import { Image, Text, StyleSheet, View } from 'react-native';

const GeminiAIChatItem = ({ item }) => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.avatar}
        source={{
          uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsZWcfooCc0MJ88CGHXClUExahq4tu2F-FGrB0iUyXKg&s',
        }}
      />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: 'cover',
  },
  textContainer: {
    marginLeft: 12,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  description: {
    marginTop: 4,
    color: 'gray',
  },
});

export default GeminiAIChatItem;