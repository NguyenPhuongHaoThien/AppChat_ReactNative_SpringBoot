import React, { useEffect, useState } from 'react';
import { StyleSheet, View, AppState, Text } from 'react-native';
import { AppRegistry } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProvider } from "./Contexts/UserContext";
import StackNavigator from './StackNavigator';
import NetInfo from "@react-native-community/netinfo";

export default function App() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      if (nextAppState === 'inactive' || nextAppState === 'background') {
        try {
          await AsyncStorage.clear();
          console.log('AsyncStorage cleared');
        } catch (error) {
          console.log('Error clearing AsyncStorage:', error);
        }
      }
    };

    AppState.addEventListener('change', handleAppStateChange);

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
      unsubscribe();
    };
  }, []);

  return (
    <UserProvider>
      <View style={styles.container}>
        {!isConnected && (
          <View style={styles.offlineContainer}>
            <Text style={styles.offlineText}>Không có kết nối mạng</Text>
          </View>
        )}
        <StackNavigator />
      </View>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  offlineContainer: {
    backgroundColor: '#b52424',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
  offlineText: {
    color: '#fff',
  },
});

AppRegistry.registerComponent('main', () => App);