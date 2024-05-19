import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "./Contexts/UserContext";
import LoginScreen from "./Views/Auth/LoginScreen";
import RegisterScreen from "./Views/Auth/RegisterScreen";
import HomeScreen from "./Views/HomeScreen";
import FriendsScreen from "./Views/FriendsScreen";
import ChatMessagesScreen from "./Views/Chat/ChatMessagesScreen";
import ChatsScreen from "./Views/Chat/ChatsScreen";
import LoadingScreen from "./Views/LoadingScreen";
import GeminiChatScreen from "./Views/GeminiChatScreen";
import ChatWithAIScreen from './Views/ChatWithAIScreen';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const { user, loginContext } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          // Nếu đã đăng nhập, lấy thông tin người dùng từ AsyncStorage
          const storedUser = await AsyncStorage.getItem("user");
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            loginContext(parsedUser.email, token, parsedUser.id, parsedUser.role);
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.log("Error checking login status", error);
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    return null; // Render loading screen or spinner while checking login status
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoading ? (
          <Stack.Screen name="Loading" component={LoadingScreen} />
        ) : user.auth ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Friends" component={FriendsScreen} />
            <Stack.Screen name="Chats" component={ChatsScreen} />
            <Stack.Screen name="Messages" component={ChatMessagesScreen} />
            <Stack.Screen name="GeminiChat" component={GeminiChatScreen} />
            <Stack.Screen name="ChatWithAI" component={ChatWithAIScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;