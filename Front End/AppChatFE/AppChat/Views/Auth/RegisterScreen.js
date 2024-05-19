import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RegisterService } from "../../Services/RegisterService";
import Icon from 'react-native-vector-icons/FontAwesome';

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (username.length < 5) {
      setUsernameError("Username must be at least 5 characters");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Invalid email format");
      return;
    }

    if (password.length < 5) {
      setPasswordError("Password must be at least 5 characters");
      return;
    }

    try {
      const user = await RegisterService.register(username, email, password, image);
      Alert.alert(
        "Registration Successful",
        "You have been registered successfully"
      );
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Registration Error", error.message);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleUsernameChange = (text) => {
    setUsername(text);
    setUsernameError("");
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={styles.logoContainer}>
          <Icon name="user-plus" size={100} color="#4A55A2" />
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Register</Text>
          <Text style={styles.subtitle}>Create Your Account</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            value={username}
            onChangeText={handleUsernameChange}
            style={[styles.input, usernameError && styles.inputError]}
            placeholderTextColor={"#BDBDBD"}
            placeholder="Enter your name"
          />
          {usernameError !== "" && (
            <Text style={styles.errorText}>{usernameError}</Text>
          )}

          <Text style={[styles.label, { marginTop: 20 }]}>Email</Text>
          <TextInput
            value={email}
            onChangeText={handleEmailChange}
            style={[styles.input, emailError && styles.inputError]}
            placeholderTextColor={"#BDBDBD"}
            placeholder="Enter your email"
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

          <Text style={[styles.label, { marginTop: 20 }]}>Image URL</Text>
          <TextInput
            value={image}
            onChangeText={(text) => setImage(text)}
            style={styles.input}
            placeholderTextColor={"#BDBDBD"}
            placeholder="Enter image URL"
          />

          <Pressable onPress={handleRegister} style={styles.registerButton}>
            <Text style={styles.registerButtonText}>Register</Text>
          </Pressable>

          <Pressable onPress={() => navigation.goBack()} style={styles.signInButton}>
            <Text style={styles.signInButtonText}>
              Already have an account? Sign In
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 50,
    marginBottom: 30,
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
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
  },
  capsLockText: {
    color: "orange",
    fontSize: 14,
    marginTop: 5,
  },
  registerButton: {
    backgroundColor: "#4A55A2",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 30,
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  signInButton: {
    marginTop: 20,
    marginBottom: 30,
  },
  signInButtonText: {
    textAlign: "center",
    color: "#616161",
    fontSize: 16,
  },
});