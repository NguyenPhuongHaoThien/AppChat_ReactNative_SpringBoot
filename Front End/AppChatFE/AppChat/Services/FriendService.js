import axios from "./axios";

const FriendService = {
    getUserFriends: async (userId) => {
        try {
          const response = await axios.get(`/api/friends/${userId}`);
          return response.data;
        } catch (error) {
          console.log("Error message", error);
          throw error;
        }
      },
  
  getAcceptedFriends: async (userId) => {
    return await axios.get(`/api/accepted-friends/${userId}`);
  },
};

export default FriendService;