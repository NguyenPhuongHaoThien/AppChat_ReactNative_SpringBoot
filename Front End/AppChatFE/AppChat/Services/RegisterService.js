// UserService.js
import axios from './axios';

export const RegisterService = {
  register: async (username, email, password, image) => { 
    try {
      const response = await axios.post('/api/users/register', {
        username,
        email,
        password,
        image,
      });

      if (response.status === 200) {
        const user = response.data;
        return user;
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      if (error.response) {
        console.log('Registration Error', error.response.data);
        throw new Error(error.response.data);
      } else if (error.request) {
        console.log('Registration Error', 'No response received from server');
        throw new Error('No response received from server');
      } else {
        console.log('Registration Error', error.message);
        throw new Error(error.message);
      }
    }
  },
};