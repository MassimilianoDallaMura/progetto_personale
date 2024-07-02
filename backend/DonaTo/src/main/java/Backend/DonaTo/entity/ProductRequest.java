package Backend.DonaTo.entity;

import Backend.DonaTo.enums.StatusRequest;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "product_requests")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // Ignora i campi Hibernate proxy
public class ProductRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    private LocalDateTime requestDate;

    @Enumerated(EnumType.STRING)
    private StatusRequest statusRequest; // Stato della richiesta (Pending, Approved, Rejected)

    private String customCode;

    private boolean confirmedDona;

    private boolean confirmedAdotta;

}
