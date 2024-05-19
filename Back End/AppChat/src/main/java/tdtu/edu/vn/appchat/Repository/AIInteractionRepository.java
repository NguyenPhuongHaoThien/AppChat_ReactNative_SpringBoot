package tdtu.edu.vn.appchat.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import tdtu.edu.vn.appchat.Model.AIInteraction;
@Repository
public interface AIInteractionRepository extends MongoRepository<AIInteraction, String> {
}
