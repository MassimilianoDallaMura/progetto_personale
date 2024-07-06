package Backend.DonaTo.service;

import Backend.DonaTo.dto.ProductRequestDTO;
import Backend.DonaTo.entity.Product;
import Backend.DonaTo.entity.ProductRequest;
import Backend.DonaTo.entity.User;
import Backend.DonaTo.enums.StatusRequest;
import Backend.DonaTo.exception.BadRequestException;
import Backend.DonaTo.exception.NotFoundException;
import Backend.DonaTo.exception.ProductNotFoundException;
import Backend.DonaTo.exception.UserNotFoundException;
import Backend.DonaTo.repository.ProductRepository;
import Backend.DonaTo.repository.ProductRequestRepository;
import Backend.DonaTo.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class ProductRequestService {

    @Autowired
    private ProductRequestRepository productRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    // Metodo per salvare una richiesta per un prodotto
    @Transactional
    public void saveProductRequest(ProductRequestDTO productRequestDTO) {
        User user = userRepository.findById(Math.toIntExact(productRequestDTO.getUserId()))
                .orElseThrow(() -> new UserNotFoundException("Utente non trovato con ID: " + productRequestDTO.getUserId()));

        Product product = getProductById(Math.toIntExact(productRequestDTO.getProductId()));

        if (productRequestRepository.existsByUserAndProduct(user, product)) {
            throw new BadRequestException("Richiesta prodotto già esistente per UserID: "
                    + productRequestDTO.getUserId() + " e ProductID: " + productRequestDTO.getProductId());
        }

        ProductRequest productRequest = new ProductRequest();
        productRequest.setUser(user);
        productRequest.setProduct(product);
        productRequest.setRequestDate(LocalDateTime.now());
        productRequest.setStatusRequest(StatusRequest.PENDING); // Status di default
        productRequest.setCustomCode(generateAndAssignCustomCode()); // Genera e assegna codice personalizzato
        productRequest.setOwner(product.getOwner()); // Assegna l'owner del prodotto alla ProductRequest

        productRequestRepository.save(productRequest);
    }

    public Product getProductById(int productId) {
        Optional<Product> productOptional = productRepository.findById(productId);

        if (productOptional.isPresent()) {
            return productOptional.get();
        } else {
            throw new ProductNotFoundException("Prodotto con ID " + productId + " non trovato");
        }
    }

    @Transactional
    public void confirmDona(int requestId, String customCode) {
        ProductRequest productRequest = getProductRequestById((long) requestId);

        if (!productRequest.getCustomCode().equals(customCode)) {
            throw new BadRequestException("Codice personalizzato non valido");
        }

        productRequest.setConfirmedDona(true);
        productRequestRepository.save(productRequest);

        if (productRequest.isConfirmedAdotta()) {
            approveProductRequest(productRequest);
        }
    }

    @Transactional
    public void confirmAdotta(int requestId, String customCode) {
        ProductRequest productRequest = getProductRequestById((long) requestId);

        if (!productRequest.getCustomCode().equals(customCode)) {
            throw new BadRequestException("Codice personalizzato non valido");
        }

        productRequest.setConfirmedAdotta(true);
        productRequestRepository.save(productRequest);

        if (productRequest.isConfirmedDona()) {
            approveProductRequest(productRequest);
        }
    }

    @Transactional
    public void deleteProductRequest(Long requestId) {
        ProductRequest productRequest = getProductRequestById((long) Math.toIntExact(requestId));
        productRequestRepository.delete(productRequest);
    }

    @Transactional
    public ProductRequest getProductRequestById(Long requestId) {
        return productRequestRepository.findById((long) requestId)
                .orElseThrow(() -> new NotFoundException("Richiesta prodotto non trovata con ID: " + requestId));
    }

    private String generateAndAssignCustomCode() {
        String alphanumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder(6); // Lunghezza minima di 6 caratteri
        Random random = new Random();

        for (int i = 0; i < 6; i++) {
            int randomIndex = random.nextInt(alphanumeric.length());
            sb.append(alphanumeric.charAt(randomIndex));
        }

        return sb.toString();
    }

    @Transactional
    public List<ProductRequest> getProductRequestsByUserId(Long userId) {
        return productRequestRepository.findByUserId(userId);
    }

    public List<Product> getProductsByUserRequests(Long userId) {
        List<ProductRequest> productRequests = productRequestRepository.findByUserId(userId);
        List<Integer> productIds = productRequests.stream()
                .map(productRequest -> productRequest.getProduct().getId())
                .collect(Collectors.toList());

        return productRepository.findAllById(productIds);
    }

    public List<ProductRequest> getProductsRequestsByOwnerId(Long ownerId) {
        return productRequestRepository.findByProductOwnerId(ownerId);
    }

    @Transactional
    private void approveProductRequest(ProductRequest productRequest) {
        productRequest.setStatusRequest(StatusRequest.APPROVED);
        productRequestRepository.save(productRequest);

        Product product = productRequest.getProduct();
        product.setDonor(productRequest.getOwner());
        product.setAdopter(productRequest.getUser());
        product.setAvailable(false);
        productRepository.save(product);

        rejectOtherRequests(productRequest.getProduct().getId(), productRequest.getId());
    }

    @Transactional
    private void rejectOtherRequests(int productId, int approvedRequestId) {
        List<ProductRequest> otherRequests = productRequestRepository.findByProductIdAndStatusRequest(productId, StatusRequest.PENDING);
        for (ProductRequest request : otherRequests) {
            if (request.getId() != approvedRequestId) {
                request.setStatusRequest(StatusRequest.REJECTED);
                productRequestRepository.save(request);
            }
        }
    }
}