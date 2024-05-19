// FriendRequest.js
import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useContext } from "react";
import { UserContext } from "../Contexts/UserContext";

const FriendRequest = ({ item, onAccept, onReject, onFriendRequestUpdate }) => {
  const { user } = useContext(UserContext);
  const currentUser = item.user || {};

  const handleAccept = () => {
    onAccept(currentUser._id);
    onFriendRequestUpdate();
  };

  const handleReject = () => {
    onReject(currentUser._id);
    onFriendRequestUpdate();
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: currentUser.image || 'https://example.com/default-avatar.png' }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{currentUser.name || currentUser.username || 'Unknown User'}</Text>
        <Text style={styles.email}>{currentUser.email || 'Unknown Email'}</Text>
        <View style={styles.buttonsContainer}>
          <Pressable onPress={handleAccept} style={[styles.button, styles.acceptButton]}>
            <Text style={styles.buttonText}>Accept</Text>
          </Pressable>
          <Pressable onPress={handleReject} style={[styles.button, styles.rejectButton]}>
            <Text style={styles.buttonText}>Reject</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  content: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  email: {
    color: "gray",
    marginBottom: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  acceptButton: {
    backgroundColor: "green",
  },
  rejectButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default FriendRequest;