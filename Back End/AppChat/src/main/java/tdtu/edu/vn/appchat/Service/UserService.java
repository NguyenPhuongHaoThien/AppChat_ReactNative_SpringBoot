package tdtu.edu.vn.appchat.Service;

import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import tdtu.edu.vn.appchat.Model.User;
import tdtu.edu.vn.appchat.Repository.UserRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class UserService {
    private UserRepository userRepository;
    private BCryptPasswordEncoder passwordEncoder;

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User updateUser(User updatedUser) {
        if (userRepository.existsById(updatedUser.getId())) {
            return userRepository.save(updatedUser);
        }
        return null;
    }

    public void register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    public boolean checkLogin(User user) {
        User userDb = findByEmail(user.getEmail());

        if (userDb == null) {
            return false;
        }

        return passwordEncoder.matches(user.getPassword(), userDb.getPassword());
    }

    public User findByEmail(String email) {
        try {
            return userRepository.findByEmail(email);
        } catch (UsernameNotFoundException e) {
            return null;
        }
    }

    public User findById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    public boolean isUserExists(String username) {
        return userRepository.existsByUsername(username);
    }

    public List<User> getUsersExceptCurrentUser(String userId) {
        // Lấy tất cả người dùng
        List<User> allUsers = userRepository.findAll();

        // Loại bỏ người dùng hiện tại
        allUsers.removeIf(user -> user.getId().equals(userId));

        return allUsers;
    }

    public List<User> getFriendRequests(String userId) {
        User user = userRepository.findById(userId).orElseThrow();
        List<String> friendRequestIds = user.getFriendRequests();
        if (friendRequestIds != null && !friendRequestIds.isEmpty()) {
            return userRepository.findAllById(friendRequestIds);
        }
        return new ArrayList<>();
    }

    public List<String> getSentFriendRequests(String userId) {
        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            throw new RuntimeException("User not found with id: " + userId);
        }

        return user.getSentFriendRequests();
    }

    public boolean sendFriendRequest(String currentUserId, String selectedUserId) {
        if (currentUserId == null || selectedUserId == null) {
            throw new IllegalArgumentException("User IDs cannot be null");
        }

        User currentUser = userRepository.findById(currentUserId).orElse(null);
        User selectedUser = userRepository.findById(selectedUserId).orElse(null);

        if (currentUser == null || selectedUser == null) {
            throw new IllegalArgumentException("Invalid user IDs");
        }

        // Kiểm tra và khởi tạo danh sách friendRequests nếu null
        if (currentUser.getFriendRequests() == null) {
            currentUser.setFriendRequests(new ArrayList<>());
        }
        if (selectedUser.getFriendRequests() == null) {
            selectedUser.setFriendRequests(new ArrayList<>());
        }

        // Kiểm tra và khởi tạo danh sách sentFriendRequests nếu null
        if (currentUser.getSentFriendRequests() == null) {
            currentUser.setSentFriendRequests(new ArrayList<>());
        }

        // Kiểm tra xem yêu cầu kết bạn đã được gửi trước đó hay chưa
        if (currentUser.getSentFriendRequests().contains(selectedUser.getId()) ||
                selectedUser.getFriendRequests().contains(currentUser.getId())) {
            return false; // Yêu cầu kết bạn đã được gửi trước đó
        }

        currentUser.getSentFriendRequests().add(selectedUser.getId());
        selectedUser.getFriendRequests().add(currentUser.getId());
        System.out.println("Sent friend request from " + currentUser.getId() + " to " + selectedUser.getId());

        userRepository.save(currentUser);
        userRepository.save(selectedUser);

        return true;
    }


    public List<User> getUserFriends(String userId) {
        User user = userRepository.findById(userId).orElseThrow();
        List<String> friendIds = user.getFriends();
        if (friendIds != null && !friendIds.isEmpty()) {
            List<User> friends = new ArrayList<>();
            for (String friendId : friendIds) {
                User friend = userRepository.findById(friendId).orElse(null);
                if (friend != null) {
                    friends.add(friend);
                }
            }
            return friends;
        }
        return new ArrayList<>();
    }

    public List<User> getAcceptedFriends(String userId) {
        User user = userRepository.findById(userId).orElseThrow();
        List<String> friendIds = user.getFriends();
        if (friendIds != null && !friendIds.isEmpty()) {
            return userRepository.findAllById(friendIds);
        }
        return new ArrayList<>();
    }

    public void cancelFriendRequest(String senderId, String recipientId) {
        User sender = userRepository.findById(senderId).orElse(null);
        User recipient = userRepository.findById(recipientId).orElse(null);

        if (sender != null && recipient != null) {
            sender.getSentFriendRequests().remove(recipientId);
            recipient.getFriendRequests().remove(senderId);

            userRepository.save(sender);
            userRepository.save(recipient);
        }
    }


    public void acceptFriendRequest(String senderId, String recipientId) {
        if (senderId == null || recipientId == null) {
            throw new IllegalArgumentException("SenderId and recipientId cannot be null");
        }

        User sender = userRepository.findById(senderId).orElse(null);
        User recipient = userRepository.findById(recipientId).orElse(null);

        if (sender != null && recipient != null) {
            if (sender.getFriends() == null) {
                sender.setFriends(new ArrayList<>());
            }
            if (recipient.getFriends() == null) {
                recipient.setFriends(new ArrayList<>());
            }

            if (!sender.getFriends().contains(recipientId)) {
                sender.getFriends().add(recipientId);
            }
            if (!recipient.getFriends().contains(senderId)) {
                recipient.getFriends().add(senderId);
            }

            if (sender.getSentFriendRequests().contains(recipientId)) {
                sender.getSentFriendRequests().remove(recipientId);
            }
            if (recipient.getFriendRequests().contains(senderId)) {
                recipient.getFriendRequests().remove(senderId);
            }

            userRepository.save(sender);
            userRepository.save(recipient);

            System.out.println("Friend request accepted. Sender: " + senderId + ", Recipient: " + recipientId);
            System.out.println("Sender friends: " + sender.getFriends());
            System.out.println("Recipient friends: " + recipient.getFriends());
        }
    }

    public void rejectFriendRequest(String senderId, String recipientId) {
        if (senderId == null || recipientId == null) {
            throw new IllegalArgumentException("SenderId and recipientId cannot be null");
        }

        User sender = userRepository.findById(senderId).orElse(null);
        User recipient = userRepository.findById(recipientId).orElse(null);

        if (sender != null && recipient != null) {
            sender.getSentFriendRequests().remove(recipientId);
            recipient.getFriendRequests().remove(senderId);

            userRepository.save(sender);
            userRepository.save(recipient);

            System.out.println("Friend request rejected. Sender: " + senderId + ", Recipient: " + recipientId);
        }
    }


}