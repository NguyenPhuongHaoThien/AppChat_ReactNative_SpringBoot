// UserContext.js
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = React.createContext({ email: '', auth: false, role: '' });

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const initialUser = { email: '', auth: false, id: null, role: '' };
    return initialUser;
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.log('Error loading user from AsyncStorage:', error);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    const saveUser = async () => {
      try {
        await AsyncStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        console.log('Error saving user to AsyncStorage:', error);
      }
    };
    saveUser();
  }, [user]);

  const loginContext = (email, token, id, role) => {
    setUser({ email: email, auth: true, token: token, id: id, role: role });
    console.log('User after login:', { email: email, auth: true, token: token, id: id, role: role });
  };

  const setToken = (token) => {
    setUser((user) => ({ ...user, token: token }));
    AsyncStorage.setItem('token', token);
  };

  const logout = () => {
    AsyncStorage.removeItem('token');
    setUser({ email: '', auth: false, role: '' });
  };

  return (
    <UserContext.Provider value={{ user, loginContext, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };