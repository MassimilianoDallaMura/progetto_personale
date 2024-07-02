package Backend.DonaTo.dto;

import Backend.DonaTo.enums.StatusRequest;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ProductRequestDTO {

    private int id;
    private Long userId;
    private Long productId;
    private LocalDateTime requestDate;
    private StatusRequest statusRequest;
    private String customCode;
}
