package Backend.DonaTo.repository;

import Backend.DonaTo.entity.Product;
import Backend.DonaTo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;




public interface UserRepository extends JpaRepository<User, Integer> {
    public Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

}
