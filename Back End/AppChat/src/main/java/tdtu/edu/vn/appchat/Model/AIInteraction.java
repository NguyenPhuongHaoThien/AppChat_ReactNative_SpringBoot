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
@Document(collection = "ai_interactions")
public class AIInteraction {
    @Id
    private String id;
    private String userId;
    private String userInput;
    private String aiResponse;
    private Date timestamp;
}
