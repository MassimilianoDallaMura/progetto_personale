package Backend.DonaTo.controller;

import Backend.DonaTo.dto.ProductDto;
import Backend.DonaTo.dto.ProductRequestDTO;
import Backend.DonaTo.entity.Product;
import Backend.DonaTo.enums.Category;
import Backend.DonaTo.enums.ProductCondictions;
import Backend.DonaTo.exception.BadRequestException;
import Backend.DonaTo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class ProductController {

    @Autowired
    private ProductService productService;

    // SALVARE
    @PostMapping("/api/products")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_USER')")
    public ResponseEntity<Product> saveProduct(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("fullAddress") String fullAddress,
            @RequestParam("city") String city,
            @RequestParam("latitude") String latitude,
            @RequestParam("longitude") String longitude,
            @RequestParam("productCondictions") ProductCondictions productCondictions,
            @RequestParam("category") Category category,
            @RequestParam("owned") boolean owned,
            @RequestParam("companyProperty") boolean companyProperty,
            @RequestParam(value = "disposalCode", required = false) String disposalCode,
            @RequestParam("toBeWithdrawn") boolean toBeWithdrawn,
            @RequestParam(value = "donorId", required = false) Long donorId,
            @RequestParam(value = "ownerId", required = false) Long ownerId,
            @RequestParam(value = "adopterId", required = false) Long adopterId,
            @RequestParam("photos") List<MultipartFile> photo) throws IOException {

        ProductDto productDto = new ProductDto();
        productDto.setTitle(title);
        productDto.setDescription(description);
        productDto.setFullAddress(fullAddress);
        productDto.setCity(city);
        productDto.setLatitude(latitude);
        productDto.setLongitude(longitude);
        productDto.setProductCondictions(productCondictions);
        productDto.setCategory(category);
        productDto.setOwned(owned);
        productDto.setCompanyProperty(companyProperty);
        productDto.setDisposalCode(disposalCode);
        productDto.setToBeWithdrawn(toBeWithdrawn);
        productDto.setDonorId(donorId);
        productDto.setOwnerId(ownerId);
        productDto.setAdopterId(adopterId);

        Product savedProduct = productService.saveProduct(productDto, photo);
        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    }


    // ESTRARRE TUTTI I PRODOTTI

    @GetMapping("/api/products")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_USER')")
    public List<Product> getAllProduct(){
        return productService.getAllProduct();
    }

    // ESTRARRE TUTTE LE CITTA'

    @GetMapping("/api/cities")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_USER')")
    public List<String> getAllCities(){
        return productService.getAllCities();
    }

    // ESTRAI PER ID PROPRIETARIO


   @GetMapping("/api/products/owner/{ownerId}")
   @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_USER')")
    public List<Product> getProductsByOwnerId(@PathVariable @Validated Long ownerId, BindingResult bindingResult) {
       if(bindingResult.hasErrors()){
           throw new BadRequestException(bindingResult.getAllErrors().stream().
                   map(objectError -> objectError.getDefaultMessage()).reduce("", ((s, s2) -> s+s2)));
       }

       return productService.getProductsByOwnerId(ownerId);
    }


    // ESTRARRE PER CITTA'
    @GetMapping("/api/products/city/{city}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_USER')")
    public List<Product> getProductsByCity(@PathVariable @Validated String city) {

        return productService.getProductsByCity(city);
    }

    // DA RITIRARE
    @GetMapping("/withdrawn-products")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<Product>> getWithdrawnProducts() {
        List<Product> withdrawnProducts = productService.getWithdrawnProducts();
        return ResponseEntity.ok().body(withdrawnProducts);
    }

    // Endpoint per recuperare un prodotto per ID
    @GetMapping("/api/product/{productId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_USER')")
    public Product getProductById(@PathVariable @Validated int productId) {

        return productService.getProductById(productId);
    }

    // ELIMINARE PR
    @DeleteMapping("/api/products/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_USER')")
    public String deleteProduct(@PathVariable int id){
        return productService.deleteProduct(id);
    }

    // AGGIORNARE

    @PutMapping("/product/{productId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_USER')")
    public ResponseEntity<?> updateProduct(@PathVariable int productId, @RequestBody @Validated ProductDto productDto, BindingResult bindingResult) {
        if(bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult.getAllErrors().stream().
                    map(objectError -> objectError.getDefaultMessage()).reduce("", ((s, s2) -> s+s2)));
        }
        productService.updateProduct(productId, productDto);
        return ResponseEntity.ok().build();
    }

    // CATEGORIE

    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_USER')")
    @GetMapping("/api/categories")
    public List<String> getCategories() {
        return productService.getCategories();
    }

    // CONDIZIONI

    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_USER')")
    @GetMapping("/api/condictions")
    public List<String> getProductConditions() {
        return productService.getProductConditions();
    }



    // METODO PER CAMBIARE DISPONIBILITA' PRODOTTO
    @PatchMapping("/api/products/{productId}/available")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_USER')")
    public ResponseEntity<Product> updateProductAvailability(
            @PathVariable int productId,
            @RequestBody ProductDto productDto) {
        productService.updateProductAvailability(productId, productDto);
        return ResponseEntity.ok().build();
    }



}







