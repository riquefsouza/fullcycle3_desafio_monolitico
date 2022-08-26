import Address from "../../@shared/domain/value-object/address.value-object";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice.entity";
import Product from "../domain/product.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import { InvoiceModel } from "./invoice.model";
import ProductModel from "./product.model";

export default class InvoiceRepository implements InvoiceGateway {
  async generate(invoice: Invoice): Promise<Invoice> {
    await InvoiceModel.create({
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipCode: invoice.address.zipCode,
      items: invoice.items.map((item) => {
        return new ProductModel({
          id: new Id(item.id.id),
          name: item.name,
          price: item.price,
          invoiceId: invoice.id.id,
        });
      }),
      total: invoice.total,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      include: [ProductModel],
    }); 
    
    return new Invoice({
      id: new Id(invoice.id.id),
      name: invoice.name,
      document: invoice.document,
      address: invoice.address,
      items: invoice.items,
    });
  }
  
  async find(id: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findOne({
      where: { id },
      include: [ProductModel],
    });

    if (!invoice) {
      throw new Error(`Invoice with id ${id} not found`);
    }

    invoice.items.map((item) => console.log(item.id));

    return new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      document: invoice.document,
      address: new Address({
        street: invoice.street,
        number: invoice.number,
        complement: invoice.complement,
        city: invoice.city,
        state: invoice.state,
        zipCode: invoice.zipCode,  
      }),
      items: invoice.items.map((item) => {
        return new Product({
          id: new Id(item.id),
          name: item.name,
          price: item.price,
        });
      }),
    });
  }
}
