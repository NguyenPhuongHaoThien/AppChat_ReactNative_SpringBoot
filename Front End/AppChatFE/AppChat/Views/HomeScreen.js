// HomeScreen.js
import React, { useLayoutEffect, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { UserContext } from "../Contexts/UserContext";
import UserService from "../Services/UserService";
import User from "../Components/User";
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const isFocused = useIsFocused();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <Text style={styles.headerTitle}>Swift Chat</Text>
      ),
      headerRight: () => (
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => navigation.navigate("Chats")}>
            <Ionicons name="chatbox-ellipses-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Friends")}>
            <MaterialIcons name="people-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={logout}>
            <Ionicons name="log-out-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
      headerBackground: () => (
        <LinearGradient
          colors={['#4c669f', '#3b5998', '#192f6a']}
          style={styles.headerBackground}
        />
      ),
    });
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchUsers();
    }
  }, [isFocused]);

  const fetchUsers = async () => {
    try {
      const response = await UserService.getUsers(user.id);
      setUsers(response.data);
    } catch (error) {
      console.log("error retrieving users", error);
    }
  };

  const handleFriendRequestSent = () => {
    fetchUsers();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.chatWithAIButton}
        onPress={() => navigation.navigate("ChatWithAI")}
      >
        <Text style={styles.chatWithAIButtonText}>Chat with AI</Text>
      </TouchableOpacity>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <User
            item={item}
            onFriendRequestSent={handleFriendRequestSent}
          />
        )}
        contentContainerStyle={styles.userList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerBackground: {
    flex: 1,
  },
  chatWithAIButton: {
    backgroundColor: "#4285F4",
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: "center",
  },
  chatWithAIButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  userList: {
    padding: 16,
  },
});

export default HomeScreen;