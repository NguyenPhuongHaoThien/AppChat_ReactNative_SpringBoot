package tdtu.edu.vn.appchat.Controller;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tdtu.edu.vn.appchat.Model.User;
import tdtu.edu.vn.appchat.Service.UserService;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
@AllArgsConstructor
public class FriendController {
    private final UserService userService;

    @GetMapping("/friends/{userId}")
    public ResponseEntity<List<User>> getUserFriends(@PathVariable String userId) {
        List<User> friends = userService.getUserFriends(userId);
        return ResponseEntity.ok(friends);
    }

    @GetMapping("/accepted-friends/{userId}")
    public ResponseEntity<List<User>> getAcceptedFriends(@PathVariable String userId) {
        List<User> acceptedFriends = userService.getAcceptedFriends(userId);
        return ResponseEntity.ok(acceptedFriends);
    }
}