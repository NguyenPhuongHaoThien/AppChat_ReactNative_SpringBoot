import axios from "./axios";

const UserService = {
    getUsers: async (userId) => {
      return await axios.get(`/api/users/${userId}`);
    },
    
    getUser: async (userId) => {
      return await axios.get(`/api/users/user/${userId}`);
    },
  };

export default UserService;