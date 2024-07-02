package Backend.DonaTo.repository;

import Backend.DonaTo.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findByCity(String city);
    List<Product> findByToBeWithdrawn(boolean toBeWithdrawn);
    List<Product> findByOwnerId(Long ownerId);


}
