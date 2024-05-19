import { StyleSheet, Text, View, FlatList, Pressable } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../Contexts/UserContext";
import { useNavigation } from "@react-navigation/native";
import UserChat from "../../Components/UserChat";
import FriendService from "../../Services/FriendService";
import MessageService from "../../Services/MessageService";
import { Ionicons } from "@expo/vector-icons";

const ChatsScreen = () => {
  const [friends, setFriends] = useState([]);
  const { user } = useContext(UserContext);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await FriendService.getUserFriends(user.id);
        console.log("User Id:", user.id);
        console.log("response:", response);
        setFriends(response);
      } catch (error) {
        console.log("error fetching friends", error);
      }
    };

    fetchFriends();
  }, [user.id]);

  const fetchLastMessage = async (friendId) => {
    try {
      const messages = await MessageService.getMessages(user.id, friendId);
      const userMessages = messages.filter(
        (message) => message.messageType === "text"
      );

      const n = userMessages.length;
      return userMessages[n - 1];
    } catch (error) {
      console.log("error fetching last message", error);
      return null;
    }
  };

  console.log("friends", friends);

  return (
    <View style={styles.container}>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable>
            <UserChat item={item} fetchLastMessage={fetchLastMessage} />
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={48} color="#BDBDBD" />
            <Text style={styles.emptyText}>No chats</Text>
          </View>
        }
        contentContainerStyle={styles.chatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  chatList: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  emptyText: {
    fontSize: 16,
    color: "#BDBDBD",
    marginTop: 8,
  },
});

export default ChatsScreen;