import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Image,
  Alert,
} from "react-native";
import React, { useState, useContext, useLayoutEffect, useEffect, useRef } from "react";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";
import { UserContext } from "../../Contexts/UserContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import MessageService from "../../Services/MessageService";
import UserService from "../../Services/UserService";

const ChatMessagesScreen = () => {
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [recepientData, setRecepientData] = useState(null);
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);
  const route = useRoute();
  const { recepientId } = route.params;
  const [message, setMessage] = useState("");
  const { user } = useContext(UserContext);

  const scrollViewRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  };

  const handleContentSizeChange = () => {
    scrollToBottom();
  };

  const handleEmojiPress = () => {
    setShowEmojiSelector(!showEmojiSelector);
  };

  const fetchMessages = async () => {
    try {
      const messages = await MessageService.getMessages(user.id, recepientId);
      setMessages(messages);
    } catch (error) {
      console.log("Error fetching messages:", error);
      Alert.alert("Error", "Failed to fetch messages. Please try again.");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [user.id, recepientId]);

  useEffect(() => {
    const fetchRecepientData = async () => {
      try {
        console.log('Fetching recipient data with recepientId:', recepientId);
        const response = await UserService.getUser(recepientId);
        console.log('API response:', response);
  
        if (response.status === 200) {
          console.log("Recipient data:", response.data);
          setRecepientData(response.data);
        } else {
          console.log("Failed to retrieve recipient data with status code:", response.status);
          Alert.alert("Error", "Failed to retrieve recipient data. Please try again.");
        }
      } catch (error) {
        console.log("Error retrieving recipient details:", error);
        Alert.alert("Error", "Failed to retrieve recipient details. Please try again.");
      }
    };
  
    fetchRecepientData();
  }, [recepientId]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      setSelectedImage(selectedAsset);
    }
  };

  const handleSend = async () => {
    try {
      console.log("Sending message...");
      const messageData = {
        senderId: user.id,
        recepientId: recepientId,
        messageType: selectedImage ? "image" : "text",
        message: message,
      };

      let response;

      if (selectedImage) {
        messageData.imageData = selectedImage.base64;
        response = await MessageService.sendMessage(messageData, null);
      } else {
        if (messageData.messageType === "text" && messageData.message.trim() === "") {
          console.log("Cannot send empty message");
          return;
        }
        response = await MessageService.sendMessage(messageData, null);
      }

      if (response.status === 200) {
        setMessage("");
        setSelectedImage(null);
        fetchMessages();
      } else {
        console.log("Failed to send message");
        Alert.alert("Error", "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.log("Error sending message:", error);
      Alert.alert("Error", "Failed to send message. Please check your internet connection and try again.");
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Ionicons
            onPress={() => navigation.goBack()}
            name="arrow-back"
            size={24}
            color="black"
          />

          {selectedMessages.length > 0 ? (
            <View>
              <Text style={{ fontSize: 16, fontWeight: "500" }}>
                {selectedMessages.length}
              </Text>
            </View>
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {recepientData && recepientData.image && (
                <Image
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    resizeMode: "cover",
                  }}
                  source={{ uri: recepientData.image }}
                />
              )}

              {recepientData ? (
                <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold" }}>
                  {recepientData.name || recepientData.username}
                </Text>
              ) : (
                <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold" }}>
                  Unknown Recipient
                </Text>
              )}
            </View>
          )}
        </View>
      ),
      headerRight: () =>
        selectedMessages.length > 0 ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Ionicons name="md-arrow-redo-sharp" size={24} color="black" />
            <Ionicons name="md-arrow-undo" size={24} color="black" />
            <FontAwesome name="star" size={24} color="black" />
            <MaterialIcons
              onPress={() => deleteMessages(selectedMessages)}
              name="delete"
              size={24}
              color="black"
            />
          </View>
        ) : null,
    });
  }, [recepientData, selectedMessages]);

  const deleteMessages = async (messageIds) => {
    try {
      const response = await MessageService.deleteMessages(messageIds);

      if (response.status === 200) {
        setSelectedMessages((prevSelectedMessages) =>
          prevSelectedMessages.filter((id) => !messageIds.includes(id))
        );

        fetchMessages();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to delete messages. Please try again.");
    }
  };

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  const handleSelectMessage = (message) => {
    const isSelected = selectedMessages.includes(message.id);

    if (isSelected) {
      setSelectedMessages((previousMessages) =>
        previousMessages.filter((id) => id !== message.id)
      );
    } else {
      setSelectedMessages((previousMessages) => [...previousMessages, message.id]);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        onContentSizeChange={handleContentSizeChange}
      >
        {messages.map((item, index) => {
          if (item.messageType === "text") {
            const isSelected = selectedMessages.includes(item.id);
            const isSentByUser = item.senderId === user.id;
            return (
              <Pressable
                onLongPress={() => handleSelectMessage(item)}
                key={index}
                style={[
                  isSentByUser
                    ? {
                        alignSelf: "flex-end",
                        backgroundColor: "#DCF8C6",
                        padding: 8,
                        maxWidth: "60%",
                        borderRadius: 7,
                        margin: 10,
                      }
                    : {
                        alignSelf: "flex-start",
                        backgroundColor: "white",
                        padding: 8,
                        margin: 10,
                        borderRadius: 7,
                        maxWidth: "60%",
                      },

                  isSelected && { width: "100%", backgroundColor: "#F0FFFF" },
                ]}
              >
                <Text
                  style={{
                    fontSize: 13,
                    textAlign: isSelected ? "right" : "left",
                  }}
                >
                  {item.message}
                </Text>
                <Text
                  style={{
                    textAlign: "right",
                    fontSize: 9,
                    color: "gray",
                    marginTop: 5,
                  }}
                >
                  {formatTime(item.timeStamp)}
                </Text>
              </Pressable>
            );
          }

          if (item.messageType === "image") {
            const imageData = item.imageData;
            const base64Image = `data:image/jpeg;base64,${imageData}`;
            const isSentByUser = item.senderId === user.id;
            return (
              <Pressable
                key={index}
                style={[
                  isSentByUser
                    ? {
                        alignSelf: "flex-end",
                        backgroundColor: "#DCF8C6",
                        padding: 8,
                        maxWidth: "60%",
                        borderRadius: 7,
                        margin: 10,
                      }
                    : {
                        alignSelf: "flex-start",
                        backgroundColor: "white",
                        padding: 8,
                        margin: 10,
                        borderRadius: 7,
                        maxWidth: "60%",
                      },
                ]}
              >
                <View>
                  <Image
                    source={{ uri: base64Image }}
                    style={{ width: 200, height: 200, borderRadius: 7 }}
                  />
                  <Text
                    style={{
                      textAlign: "right",
                      fontSize: 9,
                      position: "absolute",
                      right: 10,
                      bottom: 7,
                      color: "white",
                      marginTop: 5,
                    }}
                  >
                    {formatTime(item.timeStamp)}
                  </Text>
                </View>
              </Pressable>
            );
          }
        })}
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: "#dddddd",
          marginBottom: showEmojiSelector ? 0 : 25,
        }}
      >
        <Entypo
          onPress={handleEmojiPress}
          style={{ marginRight: 5 }}
          name="emoji-happy"
          size={24}
          color="gray"
        />

        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          {selectedImage && (
            <View style={{ marginRight: 10 }}>
              <Image
                source={{ uri: selectedImage.uri }}
                style={{ width: 30, height: 30, borderRadius: 5 }}
              />
            </View>
          )}
          <TextInput
            value={message}
            onChangeText={(text) => setMessage(text)}
            style={{
              flex: 1,
              height: 40,
              borderWidth: 1,
              borderColor: "#dddddd",
              borderRadius: 20,
              paddingHorizontal: 10,
            }}
            placeholder="Type Your message..."
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
            marginHorizontal: 8,
          }}
        >
          <Entypo onPress={pickImage} name="camera" size={24} color="gray" />

          <Feather name="mic" size={24} color="gray" />
        </View>

        <Pressable
          onPress={handleSend}
          style={{
            backgroundColor: "#007bff",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
        </Pressable>
      </View>

      {showEmojiSelector && (
        <EmojiSelector
          onEmojiSelected={(emoji) => {
            setMessage((prevMessage) => prevMessage + emoji);
          }}
          style={{ height: 250 }}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default ChatMessagesScreen;

const styles = StyleSheet.create({});