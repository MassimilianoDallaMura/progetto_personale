package Backend.DonaTo.service;
import Backend.DonaTo.dto.UserDto;
import Backend.DonaTo.entity.Product;
import Backend.DonaTo.entity.User;
import Backend.DonaTo.enums.Role;
import Backend.DonaTo.exception.ProductNotFoundException;
import Backend.DonaTo.exception.UserNotFoundException;
import Backend.DonaTo.repository.ProductRepository;
import Backend.DonaTo.repository.UserRepository;
import com.cloudinary.Transformation;
import jakarta.persistence.Id;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.cloudinary.Cloudinary;
import java.io.IOException;
import java.util.*;


@Service
public class UserService {

    @Autowired      //iniettare il repository
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private Cloudinary cloudinary;


    public String saveUser(UserDto userDto) {       //implemento il metodo per salvare
        User user = new User();     //creo user
        user.setName(userDto.getName());
        user.setSurname(userDto.getSurname());
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setCity(userDto.getCity());
        user.setRole(Role.NORMAL_USER);    //Quando utente viene creato, in automatico è user
        user.setPassword(passwordEncoder.encode(userDto.getPassword())); // non si deve mettere la password in chiaro, prima codificiamo la pass poi la si setta.


        userRepository.save(user); // la pass salvata è stata prima codificata

        return "Utente con id" + user.getId() + " salvato correttamente";

    }

    public List<User> getAllUsers(){     //metodo per estrarre tutti gli utenti -- si può aggiungere pagificazione
        return userRepository.findAll();
    }



    public Optional<User> getUserById(int id) {
        return userRepository.findById(id);
    }



    public String updateUser(int id, UserDto userDto){
        Optional<User> userOptional = getUserById(id);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setName(userDto.getName());
            user.setSurname(userDto.getSurname());
            user.setUsername(userDto.getUsername());
            user.setEmail(userDto.getEmail());
            user.setCity(userDto.getCity());
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));

            userRepository.save(user);
            return "Utente con id" + id + " modificato correttamente";

        }

        else {
            throw  new UserNotFoundException("Utente con id" + id + " non trovato");

        }

        // PER ELIMINARE USER

    }
    public String deleteUser(int id) {
        Optional<User> userOptional = userRepository.findById(id);

        if (userOptional.isPresent()){
            userRepository.deleteById(id);
            return "Utente con id " + id + " eliminato correttamente";
        } else {
            throw new UserNotFoundException("Utente con id " + id + " non trovato");
        }
    }


    //GET BY EMAIL

    public User getUserByEmail(String email){
        Optional<User> userOptional = userRepository.findByEmail(email);

        if(userOptional.isPresent()){
            return userOptional.get();
        }
        else {
            throw new UserNotFoundException("Utente con email" + email + " non trovato");
        }
    }


    //METODO PER VEDERE SE UTENTE HA GIà UNA CITTà

    public boolean hasCity(String email) {
        User user = getUserByEmail(email);
        return user.getCity() != null && !user.getCity().isEmpty();
    }




    @Transactional
    public void addProductToFavorites(int userId, int productId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
        Product product = productRepository.findById(productId).orElseThrow(() -> new ProductNotFoundException("Product not found with ID: " + productId));

        if (user.getFavouriteProducts().contains(product)) {
            throw new RuntimeException("Product already in favorites for user " + userId);
        }

        user.getFavouriteProducts().add(product);
        userRepository.save(user);
    }



    public List<Product> getFavoriteProductsForUser(int userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
        return new ArrayList<>(user.getFavouriteProducts());
    }



    @Transactional
    public void removeProductFromFavorites(int userId, int productId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
        Product product = productRepository.findById(productId).orElseThrow(() -> new ProductNotFoundException("Product not found with ID: " + productId));

        if (!user.getFavouriteProducts().contains(product)) {
            throw new RuntimeException("Product not in favorites for user " + userId);
        }

        user.getFavouriteProducts().remove(product);
        userRepository.save(user);
    }



    public boolean existsByEmail(String email) {
        // Utilizza il repository per verificare se un utente con l'indirizzo email specificato esiste già nel database
        return userRepository.existsByEmail(email);
    }




    // PATCH FOTO

    public String patchFotoUser(int id, MultipartFile avatar) {
        Optional<User> userOptional = userRepository.findById(id);

        if (userOptional.isPresent()) {
            try {
                if (avatar != null && !avatar.isEmpty()) {
                    // Impostazioni per ridimensionare l'immagine a 100x100 pixel (proporzioni quadrate)
                    Map<String, Object> options = Collections.singletonMap("transformation", new Transformation().width(100).height(100).crop("fill").gravity("face"));

                    // Effettua l'upload dell'immagine con le opzioni di trasformazione
                    String url = (String) cloudinary.uploader().upload(avatar.getBytes(), options).get("url");

                    User user = userOptional.get();
                    user.setAvatar(url);
                    userRepository.save(user);

                    return "User con id=" + id + " aggiornato correttamente con la foto inviata";
                } else {
                    return "L'avatar inviato è nullo o vuoto";
                }
            } catch (IOException e) {
                throw new RuntimeException("Errore durante l'upload dell'avatar per l'utente con id=" + id, e);
            }
        } else {
            throw new UserNotFoundException("User con id=" + id + " non trovato");
        }
    }



    public String updateCity(int userId, String city) {
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setCity(city);
            userRepository.save(user);
            return "Città aggiornata correttamente per l'utente con ID " + userId;
        } else {
            throw new UserNotFoundException("Utente con ID " + userId + " non trovato");
        }
    }


    public String updateUsername(int id, String newUsername) {
        Optional<User> userOptional = getUserById(id);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setUsername(newUsername);
            userRepository.save(user);
            return "Username dell'utente con id " + id + " aggiornato correttamente";
        } else {
            throw new UserNotFoundException("Utente con id " + id + " non trovato");
        }
    }

    public boolean isUsernameTaken(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

}
