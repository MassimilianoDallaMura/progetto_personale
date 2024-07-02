package Backend.DonaTo.repository;

import Backend.DonaTo.dto.ProductRequestDTO;
import Backend.DonaTo.entity.Product;
import Backend.DonaTo.entity.ProductRequest;
import Backend.DonaTo.entity.User;
import Backend.DonaTo.enums.StatusRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRequestRepository extends JpaRepository<ProductRequest, Long> {
    boolean existsByUserAndProduct(User user, Product product);
    List<ProductRequest> findByUserId(Long userId);
    List<ProductRequest> findByProductOwnerId(Long ownerId);
    void deleteById(Long id);
    List<ProductRequest> findByProductIdAndStatusRequest(int productId, StatusRequest statusRequest);
}
