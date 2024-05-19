package tdtu.edu.vn.appchat.Controller;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tdtu.edu.vn.appchat.Model.Message;
import tdtu.edu.vn.appchat.Service.MessageService;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/messages")
@AllArgsConstructor
public class MessageController {
    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<Message> sendMessage(@RequestBody(required = false) Message message,
                                               @RequestParam(value = "senderId", required = false) String senderId,
                                               @RequestParam(value = "recepientId", required = false) String recepientId,
                                               @RequestParam(value = "messageType", required = false) String messageType,
                                               @RequestParam(value = "message", required = false) String messageText,
                                               @RequestParam(value = "imageData", required = false) byte[] imageData) {
        if (message == null) {
            message = new Message();
        }

        if (senderId != null) {
            message.setSenderId(senderId);
        }
        if (recepientId != null) {
            message.setRecepientId(recepientId);
        }
        if (messageType != null) {
            message.setMessageType(messageType);
        }
        if (messageText != null) {
            message.setMessage(messageText);
        }

        if (imageData != null && imageData.length > 0) {
            message.setImageData(imageData);
        }

        Message savedMessage = messageService.sendMessage(message);
        return ResponseEntity.ok(savedMessage);
    }

    @GetMapping("/{senderId}/{recepientId}")
    public ResponseEntity<List<Message>> getMessages(@PathVariable String senderId, @PathVariable String recepientId) {
        System.out.println("Sender ID: " + senderId);
        System.out.println("Recipient ID: " + recepientId);
        List<Message> messages = messageService.getMessages(senderId, recepientId);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/delete")
    public ResponseEntity<Void> deleteMessages(@RequestBody List<String> messageIds) {
        messageService.deleteMessages(messageIds);
        return ResponseEntity.ok().build();
    }
}