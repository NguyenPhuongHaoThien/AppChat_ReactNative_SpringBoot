package tdtu.edu.vn.appchat.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String username;
    private String name;
    private String email;
    private String password;
    private String image;
    private List<String> friendRequests= new ArrayList<>();
    private List<String> friends = new ArrayList<>();
    private List<String> sentFriendRequests = new ArrayList<>();
    private String role = "ROLE_USER";

    public List<String> getSentFriendRequests() {
        return sentFriendRequests != null ? sentFriendRequests : new ArrayList<>();
    }

    public List<String> getFriendRequests() {
        return friendRequests != null ? friendRequests : new ArrayList<>();
    }

    public List<String> getFriends() {
        return friends != null ? friends : new ArrayList<>();
    }

    public User(String id, String username, String name, String email, String password, String image, List<String> friendRequests, List<String> friends, String role) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.email = email;
        this.password = password;
        this.image = image;
        this.friendRequests = friendRequests != null ? friendRequests : new ArrayList<>();
        this.friends = friends != null ? friends : new ArrayList<>();
        this.sentFriendRequests = new ArrayList<>();
        this.role = role;
    }
}