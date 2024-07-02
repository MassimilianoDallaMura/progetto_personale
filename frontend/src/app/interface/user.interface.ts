export interface User {
  id: number;
  name: string;
  surname: string;
  username: string;
  email: string;
  role: string;
  favorites: number[];
  city: string,
  avatar: string; // URL dell'immagine del profilo
}