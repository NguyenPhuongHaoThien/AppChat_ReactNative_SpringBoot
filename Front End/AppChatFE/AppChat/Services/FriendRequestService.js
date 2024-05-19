import axios from './axios';

const FriendRequestService = {
  getSentFriendRequests: async (userId) => {
    try {
      const response = await axios.get(`/api/friend-requests/sent/${userId}`);
      return response.data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  },

  getFriendRequests: async (userId) => {
    try {
      const response = await axios.get(`/api/friend-request/${userId}`);
      return response.data.map(user => ({ _id: user._id, user }));
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  },

  getUserFriends: async (userId) => {
    try {
      const response = await axios.get(`/api/friends/${userId}`);
      return response.data;
    } catch (error) {
      console.log("Error message", error);
      throw error;
    }
  },

  sendFriendRequest: async (currentUserId, selectedUserId) => {
    try {
      const response = await axios.post("/api/friend-request", { currentUserId, selectedUserId });
      return response.data;
    } catch (error) {
      console.log("error message", error);
      throw error;
    }
  },

  cancelFriendRequest: async (currentUserId, selectedUserId) => {
    try {
      await axios.delete("/api/friend-request/cancel", {
        data: { senderId: currentUserId, recipientId: selectedUserId }
      });
    } catch (error) {
      console.log("error message", error);
      throw error;
    }
  },

  acceptFriendRequest: async (senderId, recipientId) => {
    try {
      const response = await axios.post("/api/friend-request/accept", { senderId, recipientId });
      return response.data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  },

  rejectFriendRequest: async (senderId, recipientId) => {
    try {
      const response = await axios.delete("/api/friend-request/reject", { data: { senderId, recipientId } });
      return response.data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  },
};

export default FriendRequestService;