package tdtu.edu.vn.appchat.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import tdtu.edu.vn.appchat.Model.Message;

import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findBySenderIdAndRecepientIdOrRecepientIdAndSenderIdOrderByTimeStampAsc(String senderId, String recepientId, String recepientId2, String senderId2);
}