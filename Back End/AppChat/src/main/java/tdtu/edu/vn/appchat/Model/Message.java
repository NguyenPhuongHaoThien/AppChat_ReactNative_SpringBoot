package tdtu.edu.vn.appchat.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "messages")
public class Message {
    @Id
    private String id;
    private String senderId;
    private String recepientId;
    private String messageType;
    private String message;
    private byte[] imageData;
    private Date timeStamp;

    public Message(String senderId, String recepientId, String messageType, String message, byte[] imageData, Date timeStamp) {
        this.senderId = senderId;
        this.recepientId = recepientId;
        this.messageType = messageType;
        this.message = message;
        this.imageData = imageData;
        this.timeStamp = timeStamp;
    }
}