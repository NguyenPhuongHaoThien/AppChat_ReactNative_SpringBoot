package tdtu.edu.vn.appchat.Controller;

// AIController.java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tdtu.edu.vn.appchat.Service.AIService;

@RestController
@RequestMapping("/api/ai")
public class AIController {
    @Autowired
    private AIService aiService;

    @PostMapping
    public ResponseEntity<String> processUserInput(@RequestBody UserInput userInput) {
        String userId = userInput.getUserId(); // Lấy userId từ request hoặc từ thông tin đăng nhập
        String userMessage = userInput.getUserInput();
        String aiResponse = aiService.processUserInput(userId, userMessage);
        return ResponseEntity.ok(aiResponse);
    }

    static class UserInput {
        private String userId;
        private String userInput;

        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }

        public String getUserInput() {
            return userInput;
        }
    }
}
