package tdtu.edu.vn.appchat.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import tdtu.edu.vn.appchat.Model.User;

import java.util.List;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    User findByEmail(String email);

    List<User> findByIdNotInAndFriendsNotContaining(List<String> userIds, String userId);

    boolean existsByUsername(String username);

    List<User> findAllById(List<String> ids);
}