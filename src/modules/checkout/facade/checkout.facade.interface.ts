export interface CheckoutFacadeInputDto {
  clientId: string;
  products: {
      productId: string;
  }[];
}

export interface CheckoutFacadeOutputDto {
  id: string;
  invoiceId: string;
  status: string;
  total: number;
  products: {
      productId: string;
  }[];  
}

export interface FindCheckoutFacadeOutputDto {
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

export interface FindCheckoutFacadeInputDto {
  id: string;
}

export default interface CheckoutFacadeInterface {
  placeOrder(input: CheckoutFacadeInputDto): Promise<CheckoutFacadeOutputDto>;
  findOrder(input: FindCheckoutFacadeInputDto): Promise<FindCheckoutFacadeOutputDto>;
}
