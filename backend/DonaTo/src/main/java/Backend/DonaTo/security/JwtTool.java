package Backend.DonaTo.security;

//contiente metodi per generare il token e lo valida



import Backend.DonaTo.entity.User;
import Backend.DonaTo.exception.UnauthorizedException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;



//crea e gestice creazione token
@Component //gestita direttamente da spring e quindi istanziata
public class JwtTool {
    @Value("${jwt.secret}")
    private String secret;
    @Value("${jwt.duration}")
    private long duration;
    // crea il token impostando data di inizio, data di fine, id dell'utente e firma del token attraverso la chiave segreta
    public String createToken(User user){
        return Jwts.builder().issuedAt(new Date(System.currentTimeMillis())).
                expiration(new Date(System.currentTimeMillis() + duration)).
                subject(String.valueOf(user.getId())).
                signWith(Keys.hmacShaKeyFor(secret.getBytes())).
                compact();
    }

    //effettua la verifica del token ricevuto. Verifica la veridicità del token e la sua scadenza
    public void verifyToken(String token){
        try {
            Jwts.parser().verifyWith(Keys.hmacShaKeyFor(secret.getBytes())).
                    build().parse(token);
        }
        catch (Exception e){
            throw  new UnauthorizedException("Error in authorization, relogin!");
        }
    }

    public int getIdFromToken(String token){        //viene poi utilizzato da jwtFilter
        return Integer.parseInt(Jwts.parser().verifyWith(Keys.hmacShaKeyFor(secret.getBytes())). // hmacShKeFo permette di decriptare il token ricevuto
                build().parseSignedClaims(token).getPayload().getSubject()); //build accede a tutti gli attributi creati (creazione token, durata, ecc)
    }
}
