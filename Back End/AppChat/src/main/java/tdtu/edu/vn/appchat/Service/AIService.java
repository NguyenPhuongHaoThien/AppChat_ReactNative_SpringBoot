package tdtu.edu.vn.appchat.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tdtu.edu.vn.appchat.Model.AIInteraction;
import tdtu.edu.vn.appchat.Repository.AIInteractionRepository;

import java.util.Date;

@Service
public class AIService {
    @Autowired
    private AIInteractionRepository aiInteractionRepository;

    // Thêm phương thức xử lý tương tác với AI tại đây
    public String processUserInput(String userId, String userInput) {
        // Implement AI logic here
        String aiResponse = generateAIResponse(userInput);

        // Lưu lịch sử tương tác vào cơ sở dữ liệu
        AIInteraction interaction = new AIInteraction();
        interaction.setUserId(userId);
        interaction.setUserInput(userInput);
        interaction.setAiResponse(aiResponse);
        interaction.setTimestamp(new Date());
        aiInteractionRepository.save(interaction);

        return aiResponse;
    }

    // Phương thức tạo ra phản hồi của AI
    private String generateAIResponse(String userInput) {
        // Sử dụng thư viện hoặc dịch vụ AI để tạo ra phản hồi
        // Ví dụ đơn giản:
        return "AI response for: " + userInput;
    }
}
