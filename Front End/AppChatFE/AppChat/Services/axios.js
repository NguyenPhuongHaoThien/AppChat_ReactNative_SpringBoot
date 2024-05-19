import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const instance = axios.create({
  baseURL: 'http://192.168.123.240:8080',
});

instance.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
      console.log('Request headers:', config.headers);
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default instance;