package Backend.DonaTo.entity;


import Backend.DonaTo.enums.Category;
import Backend.DonaTo.enums.ProductCondictions;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // Ignora i campi Hibernate proxy
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private String title;
    private String description;
    @Enumerated(EnumType.STRING)
    private Category category;
    @Enumerated(EnumType.STRING)
    private ProductCondictions productCondictions;
//    private String date;
    private String latitude;
    private String longitude;
    private String fullAddress;
    private String city;
    private boolean owned; // campo per indicare se il prodotto è di proprietà dell'utente
    private boolean available; // nuovo campo per indicare se il prodotto è disponibile

    @CreationTimestamp
    private  LocalDateTime createdDate;

    private List<String> photos;

    private boolean companyProperty; // indica se il prodotto è già in attesa di essere ritirato dall'azienda
    private String disposalCode; // campo per memorizzare il codice prodotto fornito dall'azienda

    @Column(name = "to_be_withdrawn", columnDefinition = "boolean default false") // da ritirare, valore predefinito su false
    private boolean toBeWithdrawn;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @ManyToOne
    @JoinColumn(name = "donor_id")
    private User donor;

    @ManyToOne
    @JoinColumn(name = "adopter_id")
    private User adopter;



}

