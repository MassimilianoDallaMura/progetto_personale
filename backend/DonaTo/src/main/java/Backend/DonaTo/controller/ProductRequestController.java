package Backend.DonaTo.controller;

import Backend.DonaTo.dto.ProductRequestDTO;
import Backend.DonaTo.entity.Product;
import Backend.DonaTo.entity.ProductRequest;
import Backend.DonaTo.exception.BadRequestException;
import Backend.DonaTo.exception.NotFoundException;
import Backend.DonaTo.repository.ProductRequestRepository;
import Backend.DonaTo.service.ProductRequestService;
import Backend.DonaTo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
public class ProductRequestController {

    @Autowired
    private ProductService productService;
    @Autowired
    private ProductRequestService productRequestService;
    @Autowired
    private ProductRequestRepository productRequestRepository;


    // SALVARE RICHIESTA PER UN PRODOTTO
    @PostMapping("/api/productsRequests")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_USER')")
    public ResponseEntity<String> saveProductRequest(@RequestBody @Validated ProductRequestDTO productRequestDTO,
                                                     BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().stream()
                    .map(DefaultMessageSourceResolvable::getDefaultMessage)
                    .reduce("", ((s, s2) -> s + s2)));
        }

        productRequestService.saveProductRequest(productRequestDTO);
        return ResponseEntity.ok("Richiesta per il prodotto salvata correttamente");
    }


    //ESTRARRE RICHIESTE DA USER REQUEST
    @GetMapping("/api/users/{userId}/requested")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_USER')")
    public ResponseEntity<List<Product>> getProductsByUserRequests(@PathVariable Long userId) {
        List<Product> products = productRequestService.getProductsByUserRequests(userId);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }


    // ESTRAE RICHIESTA DA ID
    @GetMapping("/api/productsRequests/{requestId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_USER')")
    public ResponseEntity<?> getProductRequestById(@PathVariable Long requestId) {
        try {
            ProductRequest productRequest = productRequestService.getProductRequestById(requestId);
            return ResponseEntity.ok(productRequest);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Richiesta prodotto non trovata con ID: " + requestId);
        }
    }

    // ESTRAE LE RICHIESTE DALLO USERID

    @GetMapping("/api/productsRequests/users/{userId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_USER')")
    public ResponseEntity<?> getProductRequestsByUserId(@PathVariable Long userId) {
        try {
            List<ProductRequest> productRequests = productRequestService.getProductRequestsByUserId(userId);
            return ResponseEntity.ok(productRequests);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nessuna richiesta di prodotto trovata per l'utente con ID: " + userId);
        }
    }

    // ESTRAE LE RICHIESTE TRAMITE OWNER
    @GetMapping("/api/productsRequests/owners/{ownerId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_USER')")
    public ResponseEntity<List<ProductRequest>> getProductRequestsByOwnerId(@PathVariable Long ownerId) {
        List<ProductRequest> requests = productRequestService.getProductsRequestsByOwnerId(ownerId);
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }

    // CONFERMARE LA DONAZIONE
    @PostMapping("/api/productsRequests/confirmDona")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_USER')")
    public ResponseEntity<String> confirmDona(@RequestParam String requestId, @RequestParam String customCode) {
        try {
            int requestIdInt = Integer.parseInt(requestId); // Converte la stringa requestId in un int
            productRequestService.confirmDona(requestIdInt, customCode);
            return ResponseEntity.ok("Conferma donazione avvenuta con successo");
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Il parametro requestId non è un numero valido");
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore interno del server");
        }
    }


    // CONFERMARE L'ADOZIONE
    @PostMapping("/api/productsRequests/confirmAdotta")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_USER')")
    public ResponseEntity<String> confirmAdotta(@RequestParam String requestId, @RequestParam String customCode) {
        try {
            int requestIdInt = Integer.parseInt(requestId); // Converte la stringa requestId in un int
            productRequestService.confirmAdotta(requestIdInt, customCode);
            return ResponseEntity.ok("Adozione confermata con successo");
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Il parametro requestId non è un numero valido");
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore interno del server");
        }
    }


    // ELIMINARE UNA RICHIESTA
    @DeleteMapping("/api/productsRequests/delete/{requestId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_USER')")
    public ResponseEntity<String> deleteProductRequest(@PathVariable Long requestId) {
        productRequestService.deleteProductRequest(requestId);
        return ResponseEntity.ok("Richiesta prodotto eliminata con successo");
    }
}
