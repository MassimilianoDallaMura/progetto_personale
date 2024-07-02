package Backend.DonaTo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
    public class UserLoginDto {
        @Email
        @NotBlank(message = "Il campo non può essere vuoto, mancante o composto da soli spazi")
        private String email;
        @NotBlank(message = "Il campo non può essere vuoto, mancante o composto da soli spazi")
        @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$",
                message = "La password deve contenere almeno una lettera minuscola, una maiuscola, un numero e un carattere speciale")
        private String password;
    }

