export interface InvoiceFacadeInputDto {
  orderId: string;
  amount: number;
}

export interface InvoiceFacadeOutputDto {
  transactionId: string;
  orderId: string;
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export default interface InvoiceFacadeInterface {
  process(input: InvoiceFacadeInputDto): Promise<InvoiceFacadeOutputDto>;
}
