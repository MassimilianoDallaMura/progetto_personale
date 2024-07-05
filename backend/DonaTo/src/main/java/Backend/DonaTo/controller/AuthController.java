package Backend.DonaTo.controller;

import Backend.DonaTo.dto.UserDto;
import Backend.DonaTo.dto.UserLoginDto;
import Backend.DonaTo.exception.BadRequestException;
import Backend.DonaTo.service.AuthService;
import Backend.DonaTo.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {

    @Autowired
    private AuthService authService; //verifica se è autenticato e posso dare token
    @Autowired
    private UserService userService; //registra l'utente

    @PostMapping("/auth/register")
    private Integer register(@RequestBody @Validated UserDto userDto, BindingResult bindingResult){

        if (bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult.getAllErrors().stream().
                    map(error-> error.getDefaultMessage()).
                    reduce("", (s, s2) -> s+s2));
        }

        // Verifica se l'email è già presente nel database
        if (userService.existsByEmail(userDto.getEmail())) {
            throw new BadRequestException("L'indirizzo email è già registrato.");
        }
        if (userService.isUsernameTaken(userDto.getUsername())) {
            throw new BadRequestException("l'username è già registrato");
        }


        userService.saveUser(userDto);
        return 1;
    }
    @PostMapping("/auth/login")
    public String login (@RequestBody @Validated UserLoginDto userLoginDto, BindingResult bindingResult){  //se il metodo funziona torna un token

        if (bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult.getAllErrors().stream().
                    map(error-> error.getDefaultMessage()).
                    reduce("", (s, s2) -> s+s2));
        }

        return authService.authenticateUserAndCreateToken(userLoginDto);
    }
}




