// User.js
import { StyleSheet, Text, View, Pressable, Image, Alert } from "react-native";
import React, { useContext, useState, useEffect, useCallback } from "react";
import { UserContext } from "../Contexts/UserContext";
import FriendRequestService from "../Services/FriendRequestService";
import { Ionicons } from "@expo/vector-icons";

const User = ({ item, onFriendRequestSent }) => {
  const { user } = useContext(UserContext);
  const userId = user.id;
  const [requestSent, setRequestSent] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [userFriends, setUserFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [friendRequestsData, userFriendsData, sentFriendRequestsData] = await Promise.all([
        FriendRequestService.getFriendRequests(userId),
        FriendRequestService.getUserFriends(userId),
        FriendRequestService.getSentFriendRequests(userId),
      ]);
      setFriendRequests(friendRequestsData.map(friend => friend.id));
      setUserFriends(userFriendsData.map(friend => friend.id));
      setRequestSent(sentFriendRequestsData.includes(item.id));
    } catch (error) {
      Alert.alert(
        "Error",
        "An error occurred while fetching data. Please try again later.",
        [{ text: "OK" }],
        { cancelable: false }
      );
    } finally {
      setIsLoading(false);
    }
  }, [userId, item.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const sendFriendRequest = async (currentUserId, selectedUserId) => {
    try {
      setIsLoading(true);
      const success = await FriendRequestService.sendFriendRequest(
        currentUserId,
        selectedUserId
      );
      if (success) {
        setRequestSent(true);
        setFriendRequests([...friendRequests, selectedUserId]);
        Alert.alert(
          "Success",
          "Friend request sent successfully!",
          [{ text: "OK", onPress: () => onFriendRequestSent() }],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          "Error",
          "Failed to send friend request. Please try again.",
          [{ text: "OK" }],
          { cancelable: false }
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "An error occurred while sending the friend request. Please try again later.",
        [{ text: "OK" }],
        { cancelable: false }
      );
    } finally {
      setIsLoading(false);
      fetchData();
    }
  };

  const cancelFriendRequest = async (currentUserId, selectedUserId) => {
    try {
      setIsLoading(true);
      await FriendRequestService.cancelFriendRequest(currentUserId, selectedUserId);
      setRequestSent(false);
      setFriendRequests(friendRequests.filter(id => id !== selectedUserId));
      Alert.alert(
        "Success",
        "Friend request cancelled successfully!",
        [{ text: "OK", onPress: () => onFriendRequestSent() }],
        { cancelable: false }
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "An error occurred while cancelling the friend request. Please try again later.",
        [{ text: "OK" }],
        { cancelable: false }
      );
    } finally {
      setIsLoading(false);
      fetchData();
    }
  };

  const rejectFriendRequest = async (senderId, recipientId) => {
    try {
      setIsLoading(true);
      await FriendRequestService.rejectFriendRequest(senderId, recipientId);
      setFriendRequests(friendRequests.filter(id => id !== senderId));
      Alert.alert(
        "Success",
        "Friend request rejected successfully!",
        [{ text: "OK", onPress: () => onFriendRequestSent() }],
        { cancelable: false }
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "An error occurred while rejecting the friend request. Please try again later.",
        [{ text: "OK" }],
        { cancelable: false }
      );
    } finally {
      setIsLoading(false);
      fetchData();
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const isFriend = userFriends.includes(item.id);

  return (
    <Pressable style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image style={styles.avatar} source={{ uri: item.image }} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item?.name || item?.username}</Text>
        <Text style={styles.email}>{item?.email}</Text>
      </View>

      {isFriend ? (
        <View style={styles.friendButtonContainer}>
          <Ionicons name="checkmark-circle" size={24} color="#82CD47" />
          <Text style={styles.friendButtonText}>Friends</Text>
        </View>
      ) : requestSent || friendRequests.includes(item.id) ? (
        <Pressable
          onPress={() => cancelFriendRequest(userId, item.id)}
          style={styles.cancelButtonContainer}
        >
          <Ionicons name="close-circle" size={24} color="#FF6347" />
          <Text style={styles.cancelButtonText}>Cancel Request</Text>
        </Pressable>
      ) : friendRequests.includes(item.id) ? (
        <Pressable
          onPress={() => rejectFriendRequest(item.id, userId)}
          style={styles.rejectButtonContainer}
        >
          <Ionicons name="close-circle" size={24} color="#FF6347" />
          <Text style={styles.rejectButtonText}>Reject Request</Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => sendFriendRequest(userId, item.id)}
          style={styles.addButtonContainer}
        >
          <Ionicons name="person-add" size={24} color="#4285F4" />
          <Text style={styles.addButtonText}>Add Friend</Text>
        </Pressable>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#888",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  email: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },
  friendButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0F8E6",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  friendButtonText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#82CD47",
  },
  cancelButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFDBD8",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  cancelButtonText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#FF6347",
  },
  rejectButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFDBD8",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  rejectButtonText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#FF6347",
  },
  addButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  addButtonText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#4285F4",
  },
});

export default User;