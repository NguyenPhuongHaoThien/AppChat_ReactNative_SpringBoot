// FriendsScreen.js
import { StyleSheet, Text, View, FlatList, Alert } from "react-native";
import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../Contexts/UserContext";
import FriendRequest from "../Components/FriendRequest";
import FriendRequestService from "../Services/FriendRequestService";
import User from "../Components/User";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const FriendsScreen = () => {
  const { user } = useContext(UserContext);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchData = async () => {
    try {
      const [friendRequestsData, friendsData, sentFriendRequestsData] = await Promise.all([
        FriendRequestService.getFriendRequests(user.id),
        FriendRequestService.getUserFriends(user.id),
        FriendRequestService.getSentFriendRequests(user.id),
      ]);
      setFriendRequests(friendRequestsData);
      setFriends(friendsData);
      // Xử lý sentFriendRequestsData nếu cần
    } catch (err) {
      console.log("error message", err);
    }
  };

  const handleAcceptRequest = async (senderId) => {
    try {
      await FriendRequestService.acceptFriendRequest(senderId, user.id);
      fetchData();
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 400:
            Alert.alert("Error", "Failed to accept friend request. Invalid input data.");
            break;
          case 401:
          case 403:
            Alert.alert("Error", "Failed to accept friend request. You don't have permission.");
            break;
          case 500:
            Alert.alert("Error", "An unexpected error occurred on the server.");
            break;
          default:
            Alert.alert("Error", "An unexpected error occurred. Please try again later.");
        }
      } else {
        console.log("error accepting the friend request", err);
        Alert.alert("Error", "An unexpected error occurred. Please try again later.");
      }
    }
  };

  const handleRejectRequest = async (senderId) => {
    try {
      await FriendRequestService.rejectFriendRequest(senderId, user.id);
      fetchData();
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 400:
            Alert.alert("Error", "Failed to reject friend request. Invalid input data.");
            break;
          case 401:
          case 403:
            Alert.alert("Error", "Failed to reject friend request. You don't have permission.");
            break;
          case 500:
            Alert.alert("Error", "An unexpected error occurred on the server.");
            break;
          default:
            Alert.alert("Error", "An unexpected error occurred. Please try again later.");
        }
      } else {
        console.log("error rejecting the friend request", err);
        Alert.alert("Error", "An unexpected error occurred. Please try again later.");
      }
    }
  };

  const handleFriendRequestUpdate = () => {
    fetchData();
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Friend Requests</Text>
        <FlatList
          data={friendRequests}
          keyExtractor={(item) => item.id?.toString() || ''}
          renderItem={({ item }) => (
            <FriendRequest
              item={item}
              onAccept={() => handleAcceptRequest(item.user.id)}
              onReject={() => handleRejectRequest(item.user.id)}
              onFriendRequestUpdate={handleFriendRequestUpdate}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={48} color="#BDBDBD" />
              <Text style={styles.emptyText}>No friend requests</Text>
            </View>
          }
        />
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Friends</Text>
        <FlatList
          data={friends}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <User
              item={item}
              onFriendRequestSent={handleFriendRequestUpdate}
              onFriendRequestUpdate={handleFriendRequestUpdate}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={48} color="#BDBDBD" />
              <Text style={styles.emptyText}>No friends</Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333333",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 16,
    color: "#BDBDBD",
    marginTop: 8,
  },
});

export default FriendsScreen;