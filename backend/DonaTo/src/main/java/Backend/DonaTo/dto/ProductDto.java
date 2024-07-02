package Backend.DonaTo.dto;

import Backend.DonaTo.enums.Category;
import Backend.DonaTo.enums.ProductCondictions;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ProductDto {

    private String title;
    private String description;
    private Category category;
    private ProductCondictions productCondictions;
    private String latitude;
    private String longitude;
    private Boolean owned;
    private List<String> photos; // List<String> per gestire più immagini
    private Boolean available;
    private String fullAddress;
    private String city;
    private Long ownerId;
    private Long donorId;
    private Long adopterId;
    private Boolean toBeWithdrawn;
    private boolean companyProperty; // nuovo campo per indicare se il prodotto è già in attesa di essere ritirato dall'azienda
    private String disposalCode; // campo per memorizzare il codice prodotto fornito dall'azienda
}
