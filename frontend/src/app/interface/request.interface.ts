import { User } from './user.interface';
import { Product } from './product.interface'; 


export interface ProductRequest {
  id: number;
  user: User; 
  product: Product; 
  owner: User; 
  requestDate: string;
  statusRequest: string;  
  customCode: string;
  confirmedDona: boolean;
  confirmedAdotta: boolean;
}
