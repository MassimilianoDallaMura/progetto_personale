package Backend.DonaTo.service;


import Backend.DonaTo.dto.UserLoginDto;
import Backend.DonaTo.entity.User;
import Backend.DonaTo.exception.UnauthorizedException;
import Backend.DonaTo.security.JwtTool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


// AuthService gestisce il login
//verifica se c'è utent con quel login e se esiste pass associata ad utente. se sì viene chimato jwt per creare token che viene poi restituito
@Service
public class AuthService {

    @Autowired
    private UserService userService;
    @Autowired
    private JwtTool jwtTool; //permette di registrare e creare un token quando si loegga
    @Autowired
    private PasswordEncoder passwordEncoder;  //serve per codificare la password

    public String authenticateUserAndCreateToken(UserLoginDto userLoginDto){        //la pass è stata salvata in modo criptato. Quindi ci sarebbe errore nel momento del confronto. si usa quindi passEncod
        User user = userService.getUserByEmail(userLoginDto.getEmail());

        if(passwordEncoder.matches(userLoginDto.getPassword(),user.getPassword())){         //mathces (è uno dei metodi di passEn) chiede due paramtri: la pass data nel login e quella nel db
            return jwtTool.createToken(user);
        }
        else{
            throw  new UnauthorizedException("Error in authorization, relogin!");
        }
    }
}



