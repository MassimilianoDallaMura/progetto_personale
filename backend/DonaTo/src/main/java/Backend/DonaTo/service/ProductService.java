package Backend.DonaTo.service;

import Backend.DonaTo.dto.ProductDto;
import Backend.DonaTo.dto.ProductRequestDTO;
import Backend.DonaTo.entity.Product;
import Backend.DonaTo.entity.ProductRequest;
import Backend.DonaTo.entity.User;
import Backend.DonaTo.enums.Category;
import Backend.DonaTo.enums.ProductCondictions;
import Backend.DonaTo.enums.StatusRequest;
import Backend.DonaTo.exception.BadRequestException;
import Backend.DonaTo.exception.NotFoundException;
import Backend.DonaTo.exception.ProductNotFoundException;
import Backend.DonaTo.exception.UserNotFoundException;
import Backend.DonaTo.repository.ProductRepository;
import Backend.DonaTo.repository.ProductRequestRepository;
import Backend.DonaTo.repository.UserRepository;
import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import jakarta.transaction.Transactional;


@Service
public class ProductService {

    @Autowired
    public ProductRepository productRepository;
    @Autowired
    private Cloudinary cloudinary;
    @Autowired
    private UserRepository userRepository;
    private int userId;
    @Autowired
    private ProductRequestRepository productRequestRepository;



    // Metodo per estrarre i prodotti per owner_id
    public List<Product> getProductsByOwnerId(Long ownerId) {
        try {
        return productRepository.findByOwnerId(ownerId);
    } catch (Exception ex) {
        // Registra l'errore o gestiscilo in base alle tue esigenze
        ex.printStackTrace();
        throw new RuntimeException("Errore durante l'estrazione dei prodotti per la città: " + ex.getMessage());
    }
    }


    public List<Product> getProductsByCity(String city) {
        try {
            return productRepository.findByCity(city);
        } catch (Exception ex) {
            // Registra l'errore o gestiscilo in base alle tue esigenze
            ex.printStackTrace();
            throw new RuntimeException("Errore durante l'estrazione dei prodotti per la città: " + ex.getMessage());
        }
    }


    // METODO PER SALVARE
    @Transactional
    public Product saveProduct(ProductDto productDto, List<MultipartFile> photos) throws IOException {

        Product product = new Product();
        product.setTitle(productDto.getTitle());
        product.setDescription(productDto.getDescription());
        product.setAvailable(true); // Set available to true
        product.setLongitude(productDto.getLongitude());
        product.setLatitude(productDto.getLatitude());
        product.setProductCondictions(productDto.getProductCondictions());
        product.setToBeWithdrawn(productDto.getToBeWithdrawn());
        product.setOwned(productDto.getOwned());
        product.setFullAddress(productDto.getFullAddress());
        product.setCity(productDto.getCity());
        product.setCategory(productDto.getCategory());
        product.setDisposalCode(productDto.getDisposalCode());
        product.setCompanyProperty(productDto.isCompanyProperty());

        // Set donor, owner, and adopter if IDs are provided
        if (productDto.getDonorId() != null) {
            User donor = userRepository.findById(productDto.getDonorId().intValue()).orElseThrow(
                    () -> new UserNotFoundException("Donor not found")
            );
            product.setDonor(donor);
        }

        if (productDto.getOwnerId() != null) {
            User owner = userRepository.findById(productDto.getOwnerId().intValue()).orElseThrow(
                    () -> new UserNotFoundException("Owner not found")
            );
            product.setOwner(owner);
        }

        if (productDto.getAdopterId() != null) {
            User adopter = userRepository.findById(productDto.getAdopterId().intValue()).orElseThrow(
                    () -> new UserNotFoundException("Adopter not found")
            );
            product.setAdopter(adopter);
        }

        // Upload photos to Cloudinary and add URLs to photoUrls list
        List<String> photoUrls = new ArrayList<>();
        for (MultipartFile photo : photos) {
            if (!photo.isEmpty()) {
                Map uploadResult = cloudinary.uploader().upload(photo.getBytes(), ObjectUtils.asMap(
                        "transformation", new Transformation().width(300).height(300).crop("fill")
                ));
                String photoUrl = (String) uploadResult.get("url");
                photoUrls.add(photoUrl);
            }
        }
        product.setPhotos(photoUrls);

        productRepository.save(product);

        return product;
    }


    // METODO PER ESTRARRE TUTTI I PRODOTTI

    public List<Product> getAllProduct() {
            return productRepository.findAll();
    }


    // METODO PER PRENDERE UN PRODOTTO TRAMITE ID

    public Product getProductById(int productId) {
        // Cerca il prodotto nel repository per ID
        Optional<Product> productOptional = productRepository.findById(productId);

        // Se il prodotto è presente, restituiscilo
        if (productOptional.isPresent()) {
            return productOptional.get();
        } else {
            // Se il prodotto non esiste, genera un'eccezione o gestisci la situazione a seconda delle tue esigenze
            throw new ProductNotFoundException("Prodotto con id" + productId + "not founded");
        }
    }


    //METODO PER ELIMINARE

    public String deleteProduct(int id){
        Optional<Product> productOptional = Optional.ofNullable(getProductById(id));

        if(productOptional.isPresent()){
            productRepository.delete(productOptional.get());
            return "prodotto con id=" + id +" eliminato correttamente";
        }
        else{
            throw new NotFoundException("Studente con id=" + id + " non trovato");
        }
    }


    // METODO PER AGGIORNARE

    public void updateProduct(int productId, ProductDto productDto) {
        // Controlla se il prodotto esiste nel repository
        Optional<Product> productOptional = productRepository.findById(productId);
        if (productOptional.isPresent()) {
            Product product = productOptional.get();

            // Aggiorna i campi del prodotto con i valori dal DTO
            product.setTitle(productDto.getTitle());
            product.setDescription(productDto.getDescription());
            product.setFullAddress(productDto.getFullAddress()); // Imposta l'indirizzo completo
            product.setAvailable(productDto.getAvailable());
            product.setLongitude(productDto.getLongitude());
            product.setLatitude(productDto.getLatitude());
            product.setPhotos(Collections.singletonList(String.valueOf(productDto.getPhotos())));
            product.setProductCondictions(productDto.getProductCondictions());
            product.setOwned(productDto.getOwned());
            product.setCity(productDto.getCity());
            product.setCategory(productDto.getCategory());


            // Salva il prodotto aggiornato nel repository
            productRepository.save(product);
        } else {
            throw new RuntimeException("Product not found with ID: " + productId);
        }
    }


    // METODO PER ESTRARRE PRODOTTI DA RITIRARE

    public List<Product> getWithdrawnProducts() {
        return productRepository.findByToBeWithdrawn(true);
    }

    // METODO PER ETRARRE TUTTE LE CITTA'

    public List<String> getAllCities() {
        return productRepository.findAll()
                .stream()
                .map(Product::getCity)
                .distinct()
                .collect(Collectors.toList());
    }

    // METODO PER ESTRARRE LE CATEGORIE

        public List<String> getCategories() {
            return Arrays.stream(Category.values())
                    .map(Enum::name)
                    .collect(Collectors.toList());
        }

    // METODO PER ESTRARRE LE CONDIZIONI

    public List<String> getProductConditions() {
        return Arrays.stream(ProductCondictions.values())
                .map(Enum::name)
                .collect(Collectors.toList());
    }

    // METODO PER CAMBIARE DISPONIBILITA' PRODOTTO
    public void updateProductAvailability(int productId, ProductDto productDto) {
        // Implementa la logica per aggiornare la disponibilità del prodotto nel repository
        Product product = getProductById(productId);
        product.setAvailable(productDto.getAvailable());
        productRepository.save(product);
    }


    // Metodo per salvare una richiesta per un prodotto
//    @Transactional
//    public void saveProductRequest(ProductRequestDTO productRequestDTO) {
//        // Recupera l'utente tramite userId dalla DTO
//        User user = userRepository.findById(Math.toIntExact(productRequestDTO.getUserId()))
//                .orElseThrow(() -> new UserNotFoundException("Utente non trovato con ID: " + productRequestDTO.getUserId()));
//
//        // Recupera il prodotto tramite productId dalla DTO
//        Product product = getProductById(Math.toIntExact(productRequestDTO.getProductId()));
//
//        // Controlla se esiste già una richiesta per questo utente e prodotto
//        if (productRequestRepository.existsByUserAndProduct(user, product)) {
//            throw new BadRequestException("Richiesta prodotto già esistente per UserID: "
//                    + productRequestDTO.getUserId() + " e ProductID: " + productRequestDTO.getProductId());
//        }
//
//        // Crea una nuova istanza di ProductRequest
//        ProductRequest productRequest = new ProductRequest();
//        productRequest.setUser(user);
//        productRequest.setProduct(product);
//        productRequest.setRequestDate(LocalDateTime.now());
//        productRequest.setStatusRequest(StatusRequest.PENDING); // Status di default
//        productRequest.setCustomCode(generateAndAssignCustomCode()); // Genera e assegna codice personalizzato
//        productRequest.setOwner(product.getOwner()); // Assegna l'owner del prodotto alla ProductRequest
//
//        // Salva la ProductRequest nel repository
//        productRequestRepository.save(productRequest);
//    }

    // Metodo per generare e assegnare un codice personalizzato
//    private String generateAndAssignCustomCode() {
//        String alphanumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//        StringBuilder sb = new StringBuilder(6); // Lunghezza minima di 6 caratteri
//        Random random = new Random();
//
//        for (int i = 0; i < 6; i++) {
//            int randomIndex = random.nextInt(alphanumeric.length());
//            sb.append(alphanumeric.charAt(randomIndex));
//        }
//
//        return sb.toString();
//    }

    // Metodo per ottenere i prodotti su cui l'utente ha fatto una richiesta
//    public List<Product> getProductsByUserRequests(Long userId) {
//        // Recupera tutte le richieste fatte dall'utente
//        List<ProductRequest> productRequests = productRequestRepository.findByUserId(userId);
//
//        // Estrae gli id dei prodotti dalle richieste
//        List<Integer> productIds = productRequests.stream()
//                .map(productRequest -> productRequest.getProduct().getId()) // Product per accedere all'oggetto
//                .collect(Collectors.toList());
//
//        // Recupera i prodotti dal repository utilizzando gli id estratti
//        return productRepository.findAllById(productIds);
//    }

    // Endpoint per la conferma della donazione
//    @Transactional
//    public void confirmDona(int requestId, String customCode) {
//        ProductRequest productRequest = getProductRequestById(requestId);
//
//        // Verifica che il customCode fornito corrisponda a quello salvato nella ProductRequest
//        if (!productRequest.getCustomCode().equals(customCode)) {
//            throw new BadRequestException("Codice personalizzato non valido");
//        }
//
//        // Conferma la donazione
//        productRequest.setConfirmedDona(true);
//        productRequestRepository.save(productRequest);
//
//        // Se sia dona che adotta sono confermati, allora approva la richiesta
//        if (productRequest.isConfirmedAdotta()) {
//            approveProductRequest(productRequest);
//        }
//    }

    // Endpoint per la conferma dell'adozione
//    @Transactional
//    public void confirmAdotta(int requestId, String customCode) {
//        ProductRequest productRequest = getProductRequestById(requestId);
//
//        // Verifica che il customCode fornito corrisponda a quello salvato nella ProductRequest
//        if (!productRequest.getCustomCode().equals(customCode)) {
//            throw new BadRequestException("Codice personalizzato non valido");
//        }
//
//        // Conferma l'adozione
//        productRequest.setConfirmedAdotta(true);
//        productRequestRepository.save(productRequest);
//
//        // Se sia dona che adotta sono confermati, allora approva la richiesta
//        if (productRequest.isConfirmedDona()) {
//            approveProductRequest(productRequest);
//        }
//    }
//
//    private ProductRequest getProductRequestById(int requestId) {
//        return productRequestRepository.findById((long) requestId)
//                .orElseThrow(() -> new NotFoundException("Richiesta prodotto non trovata con ID: " + requestId));
//    }


    // Metodo per approvare una ProductRequest
//    private void approveProductRequest(ProductRequest productRequest) {
//        productRequest.setStatusRequest(StatusRequest.APPROVED);
//        productRequestRepository.save(productRequest);
//
//        // Aggiorna altri stati o invia notifiche, se necessario
//    }

    // Metodo er eliminare una richiesta

//    @Transactional
//    public void deleteProductRequest(Long requestId) {
//        ProductRequest productRequest = getProductRequestById(requestId);
//        productRequestRepository.delete(productRequest);
//    }

    // Metodo per ottenere i dati della richiesta per un dato ID
//    @Transactional
//    public ProductRequest getProductRequestById(Long requestId) {
//        return productRequestRepository.findById(requestId)
//                .orElseThrow(() -> new NotFoundException("Richiesta prodotto non trovata con ID: " + requestId));
//    }



    // Metodo per ottenere una ProductRequest dal tramite userId
//    @Transactional
//    public List<ProductRequest> getProductRequestsByUserId(Long userId) {
//        return productRequestRepository.findByUserId(userId);
//    }


}






