// LoginService.js
import axios from './axios';

export const LoginService = {
  login: async (email, password) => {
    try {
      const response = await axios.post('/api/users/login', {
        email,
        password,
      });

      if (response.status === 200) {
        const { token, user } = response.data;
        return { token, user };
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log('Login Error', error.response.data);
        throw new Error(error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.log('Login Error', 'No response received from server');
        throw new Error('No response received from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Login Error', error.message);
        throw new Error(error.message);
      }
    }
  },
};