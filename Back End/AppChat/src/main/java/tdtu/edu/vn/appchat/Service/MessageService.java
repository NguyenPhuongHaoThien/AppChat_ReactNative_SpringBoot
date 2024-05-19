package tdtu.edu.vn.appchat.Service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tdtu.edu.vn.appchat.Model.Message;
import tdtu.edu.vn.appchat.Repository.MessageRepository;

import java.util.Date;
import java.util.List;

@Service
@AllArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;

    public Message sendMessage(Message message) {
        message.setTimeStamp(new Date());
        return messageRepository.save(message);
    }

    public List<Message> getMessages(String senderId, String recepientId) {
        List<Message> messages = messageRepository.findBySenderIdAndRecepientIdOrRecepientIdAndSenderIdOrderByTimeStampAsc(senderId, recepientId, recepientId, senderId);
        System.out.println("Retrieved messages: " + messages);
        return messages;
    }

    public void deleteMessages(List<String> messageIds) {
        messageRepository.deleteAllById(messageIds);
    }
}