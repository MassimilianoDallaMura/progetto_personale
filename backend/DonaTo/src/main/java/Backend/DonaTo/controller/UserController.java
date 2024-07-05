package Backend.DonaTo.controller;

import Backend.DonaTo.dto.UserDto;
import Backend.DonaTo.entity.Product;
import Backend.DonaTo.entity.User;
import Backend.DonaTo.exception.BadRequestException;
import Backend.DonaTo.exception.UserNotFoundException;
import Backend.DonaTo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    // ESTRAE TUTTI GLI USER





    // MODIFICA USER
    @GetMapping("/api/users")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_USER')")
    public List<User> getAllUsers(){
        return userService.getAllUsers();
    }

    @GetMapping("/api/users/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_USER')")
    public User getUserById(@PathVariable int id){
        Optional<User> userOptional = userService.getUserById(id);

        if(userOptional.isPresent()){
            return userOptional.get();
        }
        else{
            throw new UserNotFoundException("User with id=" + id + " not found");
        }
    }


    //UPDATE USERNAME
    @PatchMapping("/api/users/{id}/username")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_USER')")
    public String updateUsername(@PathVariable int id, @RequestBody String username, BindingResult bindingResult) {
        if(bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult.getAllErrors().stream().map(error->error.getDefaultMessage()).
                    reduce("", (s, s2) -> s+s2));
        }

        return userService.updateUsername(id, username);
    }




    @PutMapping("/api/users/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_USER')")
    public String updateUser(@PathVariable int id, @RequestBody @Validated UserDto userDto, BindingResult bindingResult){
        if(bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult.getAllErrors().stream().map(error->error.getDefaultMessage()).
                    reduce("", (s, s2) -> s+s2));
        }

        return userService.updateUser(id, userDto);
    }

    // PATCH FOTO AVATAR

    @PatchMapping("/api/users/{id}/photo")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_USER')")
    public String patchFotoUser(@RequestParam("avatar") MultipartFile avatar, @PathVariable int id) throws IOException {
        return userService.patchFotoUser(id, avatar);
    }



    // AGGIUNGE PREFERITO

    @PostMapping("/api/users/{userId}/favorites/{productId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_USER')")
    public ResponseEntity<?> addToFavorites(@PathVariable Long userId, @PathVariable int productId) {
        userService.addProductToFavorites(Math.toIntExact(userId), productId);
        return ResponseEntity.ok("Product added to favorites");
    }

    // ESTRAE PREFERITI

    @GetMapping("/api/users/{userId}/favorites")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_USER')")
    public List<Product> getFavoriteProductsForUser(@PathVariable int userId) {
        return userService.getFavoriteProductsForUser(userId);
    }



    // ELIMINA PREFERITO

    @DeleteMapping("/api/users/{userId}/favorites/{productId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_USER')")
    public ResponseEntity<?> removeFromFavorites(@PathVariable Long userId, @PathVariable int productId) {
        userService.removeProductFromFavorites(Math.toIntExact(userId), productId);
        return ResponseEntity.ok("Product removed from favorites");
    }


    //METODO PER VEDERE SE UTENTE HA GIà UNA CITTà


    @GetMapping("/has-city")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_USER')")
    public ResponseEntity<Boolean> hasCity(@RequestParam String email) {
        boolean hasCity = userService.hasCity(email);
        return ResponseEntity.ok(hasCity);
    }

    //METODO PER AGGIUNGERE CITTà AD UTENTE

    @PatchMapping("/api/cities/users/{id}/city")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_USER')")
    public ResponseEntity<String> updateCity(@PathVariable int id, @RequestBody Map<String, String> cityMap) {
        String city = cityMap.get("city");
        String message = userService.updateCity(id, city);
        return ResponseEntity.ok().body(message);
    }


    // DELETE endpoint per eliminare un utente

    @DeleteMapping("/api/users/{id}") // Assicurati di includere lo slash prima di {id}
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_USER')")
    public String deleteUser(@PathVariable int id){
        return userService.deleteUser(id);
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_USER')")
    @GetMapping("/api/users/check-username")
    public ResponseEntity<Boolean> checkUsername(@RequestParam String username) {
        boolean isTaken = userService.isUsernameTaken(username);
        return ResponseEntity.ok(isTaken);
    }

}