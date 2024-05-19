import React, { useState, useEffect, useContext } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  Animated,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../../Contexts/UserContext";
import { LoginService } from "../../Services/LoginService";
import Icon from 'react-native-vector-icons/FontAwesome';

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigation = useNavigation();
  const { user, loginContext } = useContext(UserContext);

  const logoAnimation = new Animated.Value(0);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");

        if (token) {
          navigation.replace("Home");
        } else {
          // token not found, show the login screen itself
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    checkLoginStatus();

    Animated.timing(logoAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      setEmailError("Invalid email format");
      return;
    }

    if (password.length < 5) {
      setPasswordError("Password must be at least 5 characters");
      return;
    }

    try {
      const { token, user } = await LoginService.login(email, password);
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      loginContext(user.email, token, user.id, user.role);
      navigation.replace("Home");
    } catch (error) {
      Alert.alert("Login Error", error.message);
      console.log("Login Error", error);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    setEmailError("");
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    setPasswordError("");
    setIsCapsLockOn(text !== text.toLowerCase());
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <View style={styles.logoContainer}>
          <Animated.View
            style={[
              styles.logoIcon,
              {
                transform: [
                  {
                    scale: logoAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Icon name="user-circle" size={100} color="#4A55A2" />
          </Animated.View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>Sign In to Your Account</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={handleEmailChange}
            style={[styles.input, emailError && styles.inputError]}
            placeholderTextColor={"#BDBDBD"}
            placeholder="Enter Your Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {emailError !== "" && (
            <Text style={styles.errorText}>{emailError}</Text>
          )}

          <Text style={[styles.label, { marginTop: 20 }]}>Password</Text>
          <TextInput
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry={true}
            style={[styles.input, passwordError && styles.inputError]}
            placeholderTextColor={"#BDBDBD"}
            placeholder="Password"
          />
          {passwordError !== "" && (
            <Text style={styles.errorText}>{passwordError}</Text>
          )}
          {isCapsLockOn && (
            <Text style={styles.capsLockText}>
              <Icon name="exclamation-triangle" size={16} color="orange" />{" "}
              Caps Lock is on
            </Text>
          )}

          <Pressable onPress={handleLogin} style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Login</Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate("Register")}
            style={styles.signUpButton}
          >
            <Text style={styles.signUpButtonText}>
              Don't have an account? Sign Up
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 50,
    marginBottom: 30,
  },
  logoIcon: {
    width: 100,
    height: 100,
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#4A55A2",
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 20,
    color: "#616161",
    marginTop: 10,
  },
  inputContainer: {
    width: "100%",
    marginTop: 30,
  },
  label: {
    fontSize: 16,
    color: "#212121",
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#212121",
    backgroundColor: "#F5F5F5",
  },
  inputError: {
    borderColor: "#F44336",
  },
  errorText: {
    color: "#F44336",
    fontSize: 14,
    marginTop: 5,
  },
  capsLockText: {
    color: "orange",
    fontSize: 14,
    marginTop: 5,
  },
  loginButton: {
    backgroundColor: "#4A55A2",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 30,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  signUpButton: {
    marginTop: 20,
  },
  signUpButtonText: {
    textAlign: "center",
    color: "#616161",
    fontSize: 16,
  },
});