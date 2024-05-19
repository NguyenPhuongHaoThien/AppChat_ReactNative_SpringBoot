package tdtu.edu.vn.appchat.Controller;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tdtu.edu.vn.appchat.Model.User;
import tdtu.edu.vn.appchat.Service.UserService;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
@AllArgsConstructor
public class FriendRequestController {
    private final UserService userService;

    @GetMapping("/friend-request/{userId}")
    public ResponseEntity<List<User>> getFriendRequests(@PathVariable String userId) {
        List<User> friendRequests = userService.getFriendRequests(userId);
        return ResponseEntity.ok(friendRequests);
    }

    @GetMapping("/friend-requests/sent/{userId}")
    public ResponseEntity<List<String>> getSentFriendRequests(@PathVariable String userId) {
        List<String> sentFriendRequests = userService.getSentFriendRequests(userId);
        return ResponseEntity.ok(sentFriendRequests);
    }

    @PostMapping("/friend-request")
    public ResponseEntity<Boolean> sendFriendRequest(@RequestBody Map<String, String> requestBody) {
        String currentUserId = requestBody.get("currentUserId");
        String selectedUserId = requestBody.get("selectedUserId");

        boolean success = userService.sendFriendRequest(currentUserId, selectedUserId);
        return ResponseEntity.ok(success);
    }

    @DeleteMapping("/friend-request/cancel")
    public ResponseEntity<Void> cancelFriendRequest(@RequestBody Map<String, String> requestBody) {
        String senderId = requestBody.get("senderId");
        String recipientId = requestBody.get("recipientId");
        userService.cancelFriendRequest(senderId, recipientId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/friend-request/accept")
    public ResponseEntity<Void> acceptFriendRequest(@RequestBody Map<String, String> requestBody) {
        String senderId = requestBody.get("senderId");
        String recipientId = requestBody.get("recipientId");

        if (senderId == null || recipientId == null) {
            return ResponseEntity.badRequest().build();
        }

        userService.acceptFriendRequest(senderId, recipientId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/friend-request/reject")
    public ResponseEntity<Void> rejectFriendRequest(@RequestBody Map<String, String> requestBody) {
        String senderId = requestBody.get("senderId");
        String recipientId = requestBody.get("recipientId");
        userService.rejectFriendRequest(senderId, recipientId);
        return ResponseEntity.ok().build();
    }

}