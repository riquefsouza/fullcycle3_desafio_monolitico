import Client from "../../domain/client.entity";
import Product from "../../domain/product.entity";

export interface FindOrderInputDto {
  id: string;
}

export interface FindOrderOutputDto {
  id: string;
  client: {
    id: string;
    name: string;
    email: string;
    document: string;
    street: string;
    number: string;
    complement: string;
    city: string;
    state: string;
    zipCode: string;
  };
  products: {
      id: string;
      name: string;
      description: string;
      salesPrice: number;
  }[];  
  status?: string;
  createdAt: Date;
}
