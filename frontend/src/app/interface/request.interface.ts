// product-request.interface.ts

import { User } from './user.interface'; // Assumendo che esista un'interfaccia per User
import { Product } from './product.interface'; // Assumendo che esista un'interfaccia per Product


export interface ProductRequest {
  id: number;
  user: User; // Interfaccia per rappresentare l'utente
  product: Product; // Interfaccia per rappresentare il prodotto
  owner: User; // Interfaccia per rappresentare il proprietario
  requestDate: string; // LocalDateTime può essere mappato come stringa
  statusRequest: string; // 
  customCode: string;
  confirmedDona: boolean;
  confirmedAdotta: boolean;
}
