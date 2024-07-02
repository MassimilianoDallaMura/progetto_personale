export interface Product {
  owner: any;
  id: any;
  companyCode: any;
  title: string;
  description: string;
  category: string;
  productCondictions: string;
  latitude: number;
  longitude: number;
  owned: boolean;
  foto: string;
  available: boolean;
  fullAddress: string;
  city: string;
  ownerId: number | null;
  donorId: number | null;
  adopterId: number | null;
  toBeWithdrawn: boolean;
  companyProperty: boolean;
  disposalCode: string | null;
  isFavorite: boolean;
  createdDate: string;
  photos: string[]; 
  distance?: string;
  }
  