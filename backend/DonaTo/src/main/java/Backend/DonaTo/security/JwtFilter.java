package Backend.DonaTo.security;


import Backend.DonaTo.entity.User;
import Backend.DonaTo.exception.NotFoundException;
import Backend.DonaTo.exception.UnauthorizedException;
import Backend.DonaTo.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Component
public class JwtFilter extends OncePerRequestFilter {
    @Autowired
    private JwtTool jwtTool;
    @Autowired
    private UserService userService;



    @Override //metodo per verificare che nella richiesta ci sia il token, altrimenti non si è autorizzati
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");


        if(authHeader==null || !authHeader.startsWith("Bearer ")){
            throw  new UnauthorizedException("Error in authorization, token missing!");
        }

        String token = authHeader.substring(7); //estrae token

        jwtTool.verifyToken(token); //verifica tolen

        //metodo per decodificare token e estrarre id in hwtTool

        int userId = jwtTool.getIdFromToken(token);
        //aggiunta di questa sezione per recuperare lo user che ha l'id che si trova nel token. Serve
        //per creare un oggetto di tipo authentication che contiene i ruoli dell'utente e inserirli nel contesto della sicurezza
        Optional<User> userOptional = userService.getUserById(userId); //crea userOptional e lo associa a quell id

        if(userOptional.isPresent()){
            User user = userOptional.get();
            System.out.println(user);

            Authentication authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities()); //indica qual è ruolo dell'utente. getAuth è metodo dell'interfaccia UserDetails che restituisce lista di tutti i ruoli assegnati
            SecurityContextHolder.getContext().setAuthentication(authentication); // authentication viene messo nel contesto della sicurezza. Tutto questo permette di gestire i ruoli indicando cosa possono fare(nel config)
        }
        else{
            throw new NotFoundException("User with id=" + userId + " not found");
        }

        filterChain.doFilter(request, response);
    }


    @Override //permette di non effettuare l'autenticazione per usare i servizi di autenticazione
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {

        return new AntPathMatcher().match("/auth/**", request.getServletPath()); //istruzione che prende path originale della richiestae aggiune auth/**.   Se arrivano richieste per endpoint che ha patch autch non vengono bloccate
    }

}






