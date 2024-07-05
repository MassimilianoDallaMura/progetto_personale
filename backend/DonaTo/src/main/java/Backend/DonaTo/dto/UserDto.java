package Backend.DonaTo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

    @Data
    public class UserDto {    //verrà usato in fase di REGISTRAZIONE utente

        @NotBlank(message = "Il campo non può essere vuoto, mancante o composto da soli spazi")
        @Size(min = 3, max = 25, message = "Il nome deve contenere tra 5 e 25 caratteri")
        private String name;
        @NotBlank(message = "Il campo non può essere vuoto, mancante o composto da soli spazi")
        @Size(min = 3, max = 50, message = "Il cognome deve contenere tra 5 e 50 caratteri")
        private  String surname;
        @NotBlank(message = "Il campo non può essere vuoto, mancante o composto da soli spazi")
        @Size(min = 3, max = 15, message = "l' username deve contenere tra 5 e 10 caratteri")
        private String username;
        private String city;
        @Email
        @NotBlank(message = "Il campo non pù essere vuoto, mancante o composto da soli spazi")
        private String email;
        @NotBlank(message = "Il campo non pù essere vuoto, mancante o composto da soli spazi")
        @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$",
                message = "La password deve contenere almeno una lettera minuscola, una maiuscola, un numero e un carattere speciale")
        private String password;
        private List<Integer> favouriteProductIds; // Lista degli ID dei prodotti preferiti


    }

