package tdtu.edu.vn.appchat.Controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tdtu.edu.vn.appchat.Model.User;
import tdtu.edu.vn.appchat.Service.UserService;
import tdtu.edu.vn.appchat.Util.JwtUtilsHelper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {
    private final UserService userService;
    private final JwtUtilsHelper jwtUtilsHelper;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        userService.register(user);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        if (user.getEmail() == null || user.getPassword() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email and password are required fields");
        }

        if (userService.checkLogin(user)) {
            User userDb = userService.findByEmail(user.getEmail());
            String token = jwtUtilsHelper.generateToken(userDb.getEmail(), "USER", userDb.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", userDb);

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<User>> getUsersExceptCurrentUser(@PathVariable String userId) {
        List<User> users = userService.getUsersExceptCurrentUser(userId);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<User> getUser(@PathVariable String userId) {
        User user = userService.findById(userId);
        return ResponseEntity.ok(user);
    }
}