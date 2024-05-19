import React, { useState, useEffect, useRef } from 'react';
import * as GoogleGenerativeAI from '@google/generative-ai';
import { StyleSheet, TouchableOpacity, View, Text, ActivityIndicator, Vibration, Animated, PermissionsAndroid, Platform } from 'react-native';
import * as Speech from 'expo-speech';
import { FontAwesome, Ionicons, MaterialIcons } from 'react-native-vector-icons';
import { GiftedChat, Bubble, InputToolbar, Send } from 'react-native-gifted-chat';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import uuid from 'react-native-uuid';

const API_KEY = 'AIzaSyBB3TxNligHLZVTAyLcYkzcm54yTf1tiyc';
const REV_AI_ACCESS_TOKEN = '02ec5t0fz9brne7Woysz8jiKFYO5Fu6YnvMg11_cKYgG9QdLa4YwFBSfs4tEV1SKRNI7K838DG03uRFjKXrV0Ox4CGrxQ';

const GeminiChat = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recordingRef = useRef(null);
  const micIconAnimation = useRef(new Animated.Value(0)).current;
  const speakerIconAnimation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    const startChat = async () => {
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = 'Xin chào! ';
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      setMessages([
        {
          _id: uuid.v4(),
          text,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Gemini Trợ Lý AI',
            avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsZWcfooCc0MJ88CGHXClUExahq4tu2F-FGrB0iUyXKg&s',
          },
        },
      ]);
    };
    startChat();
  }, []);


  const handleBackPress = () => {
    navigation.goBack();
  };

  const onSend = async (newMessages = []) => {
    const newMessagesWithId = newMessages.map(message => ({
      ...message,
      _id: uuid.v4(),
    }));

    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, newMessagesWithId)
    );
    setLoading(true);

    const userMessage = newMessagesWithId[0];
    const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = userMessage.text;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const botMessage = {
      _id: uuid.v4(),
      text,
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'Gemini Trợ Lý AI',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsZWcfooCc0MJ88CGHXClUExahq4tu2F-FGrB0iUyXKg&s',
      },
    };

    setMessages(prevMessages => [botMessage, ...prevMessages]);
    setLoading(false);

    if (text && !isSpeaking) {
      Speech.speak(text, { language: 'vi' });
      setIsSpeaking(true);
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      Animated.timing(speakerIconAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      const lastMessage = messages[0];
      if (lastMessage && lastMessage.text) {
        Speech.speak(lastMessage.text, { language: 'vi' });
        setIsSpeaking(true);
        Animated.timing(speakerIconAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Quyền truy cập Microphone',
            message: 'Ứng dụng cần quyền truy cập microphone của bạn để ghi âm.',
            buttonNeutral: 'Hỏi lại sau',
            buttonNegative: 'Hủy',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Quyền truy cập microphone đã được cấp');
          return true;
        } else {
          console.log('Quyền truy cập microphone bị từ chối');
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true;
    }
  };

  const startRecording = async () => {
    try {
      if (isRecording) {
        console.log('Đang ghi âm');
        return;
      }

      const microphonePermissionGranted = await requestMicrophonePermission();
      if (!microphonePermissionGranted) {
        console.log('Quyền truy cập microphone chưa được cấp');
        return;
      }

      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();

      setIsRecording(true);
      recordingRef.current = recording;
      Vibration.vibrate(100); // Rung nhẹ để báo hiệu bắt đầu ghi âm
      console.log('Bắt đầu ghi âm');
    } catch (err) {
      console.error('Không thể bắt đầu ghi âm', err);
    }
  };

  const stopRecording = async () => {
    console.log('Đang dừng ghi âm..');
    try {
      if (!isRecording || !recordingRef.current) {
        console.log('Không có quá trình ghi âm nào đang diễn ra');
        return;
      }

      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;

      console.log('Ghi âm đã dừng và được lưu tại', uri);
      setIsRecording(false);
      Vibration.vibrate(100); // Rung nhẹ để báo hiệu dừng ghi âm

      const formData = new FormData();
      formData.append('media', {
        uri: uri,
        type: 'audio/m4a',
        name: 'recording.m4a',
      });
      formData.append('metadata', JSON.stringify({ language: 'vi' }));

      try {
        const response = await axios.post('https://api.rev.ai/speechtotext/v1/jobs', formData, {
          headers: {
            Authorization: `Bearer ${REV_AI_ACCESS_TOKEN}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        const jobId = response.data.id;
        console.log('Công việc chuyển giọng nói thành văn bản đã được gửi. Job ID:', jobId);

        // Kiểm tra trạng thái của job cho đến khi hoàn thành
        let jobStatus = '';
        while (jobStatus !== 'transcribed') {
          await new Promise((resolve) => setTimeout(resolve, 5000)); // Đợi 5 giây trước khi kiểm tra lại
          const statusResponse = await axios.get(`https://api.rev.ai/speechtotext/v1/jobs/${jobId}/transcript`, {
            headers: {
              Authorization: `Bearer ${REV_AI_ACCESS_TOKEN}`,
              Accept: 'application/vnd.rev.transcript.v1.0+json',
            },
          });

          console.log('Phản hồi trạng thái job:', statusResponse.data);

          if (statusResponse.data.monologues) {
            jobStatus = 'transcribed';
            console.log('Job đã hoàn thành');

            const monologues = statusResponse.data.monologues;
            let recognizedText = '';

            monologues.forEach((monologue) => {
              monologue.elements.forEach((element) => {
                if (element.type === 'text') {
                  recognizedText += element.value + ' ';
                }
              });
            });

            recognizedText = recognizedText.trim();

            if (recognizedText) {
              console.log('Văn bản đã nhận dạng:', recognizedText);

              const userMessage = {
                _id: uuid.v4(),
                text: recognizedText,
                createdAt: new Date(),
                user: {
                  _id: 1,
                  name: 'User',
                  avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsZWcfooCc0MJ88CGHXClUExahq4tu2F-FGrB0iUyXKg&s',
                },
              };

              setMessages((prevMessages) => [userMessage, ...prevMessages]);
              handleSpeechRecognitionMessage(userMessage);
            } else {
              console.log('Không tìm thấy văn bản đã nhận dạng trong phản hồi.');
            }
          } else {
            console.log('Đang chờ job hoàn thành...');
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 409) {
          console.error('Đã xảy ra lỗi xung đột (409). Vui lòng thử lại sau.');
          // Hiển thị thông báo lỗi cho người dùng hoặc thử lại yêu cầu sau một khoảng thời gian
        } else {
          console.error('Lỗi nhận dạng giọng nói:', error);
        }
      }
    } catch (error) {
      console.error('Lỗi dừng ghi âm:', error);
    }
  };

  const handleSpeechRecognitionMessage = async (userMessage) => {
    setLoading(true);

    const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = userMessage.text;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const botMessage = {
      _id: uuid.v4(),
      text,
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'Gemini Trợ Lý AI',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsZWcfooCc0MJ88CGHXClUExahq4tu2F-FGrB0iUyXKg&s',
      },
    };

    setMessages(prevMessages => [botMessage, ...prevMessages]);
    setLoading(false);

    if (text && !isSpeaking) {
      Speech.speak(text, { language: 'vi' });
      setIsSpeaking(true);
    }
  };

  const ClearMessage = () => {
    setMessages([]);
    setIsSpeaking(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gemini Trợ Lý AI</Text>
        <TouchableOpacity style={styles.clearButton} onPress={ClearMessage}>
          <MaterialIcons name="delete" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => onSend(newMessages)}
        user={{
          _id: 1,
          name: 'User',
          avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsZWcfooCc0MJ88CGHXClUExahq4tu2F-FGrB0iUyXKg&s',
        }}
        renderBubble={(props) => (
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor: '#007aff',
              },
              left: {
                backgroundColor: '#f0f0f0',
              },
            }}
            textStyle={{
              right: {
                color: '#fff',
              },
              left: {
                color: '#333',
              }
            }}
          />
        )}
        renderInputToolbar={(props) => (
          <InputToolbar
            {...props}
            containerStyle={styles.inputContainer}
            primaryStyle={[styles.input, { borderColor: '#007aff', borderWidth: 1 }]}
          />
        )}
        renderSend={(props) => (
          <Send {...props}>
            <View style={styles.sendIcon}>
              <FontAwesome
                name="send"
                size={18}
                color="white"
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              />
            </View>
          </Send>
        )}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007aff" />
          </View>
        )}
        renderActions={(props) => (
          <View style={styles.actionContainer}>
            <Animated.View
              style={[
                styles.micIcon,
                isRecording && styles.recordingMicIcon,
                {
                  transform: [
                    {
                      scale: micIconAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.2],
                      }),
                    },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                onPressIn={startRecording}
                onPressOut={stopRecording}
              >
                <FontAwesome
                  name={isRecording ? 'stop' : 'microphone'}
                  size={18}
                  color="white"
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                />
              </TouchableOpacity>
            </Animated.View>
            <Animated.View
              style={[
                styles.speakerIcon,
                {
                  transform: [
                    {
                      scale: speakerIconAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.2],
                      }),
                    },
                  ],
                },
              ]}
            >
              <TouchableOpacity onPress={toggleSpeech}>
                <FontAwesome
                  name={isSpeaking ? 'volume-up' : 'volume-off'}
                  size={18}
                  color="white"
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                />
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#007aff',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearButton: {
    marginLeft: 10,
  },
  inputContainer: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 20,
    height: 40,
    color: '#333',
    paddingHorizontal: 16,
  },
  sendIcon: {
    padding: 8,
    backgroundColor: '#007aff',
    borderRadius: 20,
    height: 36,
    width: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  micIcon: {
    padding: 8,
    backgroundColor: '#007aff',
    borderRadius: 20,
    height: 36,
    width: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  recordingMicIcon: {
    backgroundColor: 'red',
  },
  speakerIcon: {
    padding: 8,
    backgroundColor: '#007aff',
    borderRadius: 20,
    height: 36,
    width: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GeminiChat;