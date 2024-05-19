import axios from "./axios";

const MessageService = {
  getMessages: async (userId, recepientId) => {
    try {
      const response1 = await axios.get(`/api/messages/${userId}/${recepientId}`);
      const response2 = await axios.get(`/api/messages/${recepientId}/${userId}`);
      const messages = [...response1.data, ...response2.data];
      messages.sort((a, b) => new Date(a.timeStamp) - new Date(b.timeStamp));
      return messages;
    } catch (error) {
      console.log("Error fetching messages:", error);
      return [];
    }
  },
  
  sendMessage: async (messageData, imageFile) => {
    if (imageFile) {
      const formData = new FormData();
      formData.append("senderId", messageData.senderId);
      formData.append("recepientId", messageData.recepientId);
      formData.append("messageType", messageData.messageType);
      formData.append("message", messageData.message);

      // Chuyển đổi hình ảnh thành mảng byte
      const byteArray = await convertImageToByteArray(imageFile);
      formData.append("imageData", new Blob([byteArray], { type: imageFile.type }));
  
      return await axios.post("/api/messages", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      return await axios.post("/api/messages", messageData, {
        headers: { "Content-Type": "application/json" },
      });
    }
  },
  
  deleteMessages: async (messageIds) => {
    return await axios.post("/api/messages/delete", messageIds);
  },
};

const convertImageToByteArray = async (imageFile) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result;
      const byteArray = new Uint8Array(arrayBuffer);
      resolve(byteArray);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsArrayBuffer(imageFile);
  });
};

export default MessageService;