import { Sequelize } from "sequelize-typescript";
import Address from "../../@shared/domain/value-object/address.value-object";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice.entity";
import Product from "../domain/product.entity";
import { InvoiceModel } from "./invoice.model";
import InvoiceRepository from "./invoice.repository";
import { ProductModel } from "./product.model";

describe("InvoiceRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate a invoice", async () => {
    const invoiceProps = {
      id: new Id("1"),
      name: "Invoice 1",
      document: "document 1",
      address: new Address({
        street: "street 1",
        number: "000",
        complement: "apartment 1",
        city: "city 1",
        state: "state 1",
        zipCode: "00000",
      }),
      items: [
        new Product({ id: new Id("1"), name: "item 1", price: 10 }), 
        new Product({ id: new Id("2"), name: "item 2", price: 20 }),
      ],      
    };

    const invoice = new Invoice(invoiceProps);
    const invoiceRepository = new InvoiceRepository();
    await invoiceRepository.generate(invoice);

    const invoiceDb = await InvoiceModel.findOne({
      where: { id: invoiceProps.id.id },
      include: [ProductModel],
    });

    expect(invoiceProps.id.id).toEqual(invoiceDb.id);
    expect(invoiceProps.name).toEqual(invoiceDb.name);
    expect(invoiceProps.document).toEqual(invoiceDb.document);
    expect(invoiceProps.address.street).toEqual(invoiceDb.street);
    expect(invoiceProps.address.number).toEqual(invoiceDb.number);
    expect(invoiceProps.address.complement).toEqual(invoiceDb.complement);
    expect(invoiceProps.address.city).toEqual(invoiceDb.city);
    expect(invoiceProps.address.state).toEqual(invoiceDb.state);
    expect(invoiceProps.address.zipCode).toEqual(invoiceDb.zipCode);
    expect(invoiceProps.items).toStrictEqual([
        new Product({ 
          id: new Id(invoiceDb.items[0].id), 
          name: invoiceDb.items[0].name, 
          price: invoiceDb.items[0].price,
        }), 
        new Product({ 
          id: new Id(invoiceDb.items[1].id), 
          name: invoiceDb.items[1].name, 
          price: invoiceDb.items[1].price,
        }), 
    ]);

  });

  it("should find a invoice", async () => {
    const invoiceRepository = new InvoiceRepository();

    await InvoiceModel.create({
      id: "1",
      name: "Invoice 1",
      document: "document 1",
      street: "street 1",
      number: "000",
      complement: "apartment 1",
      city: "city 1",
      state: "state 1",
      zipCode: "00000",
      items: [
        new ProductModel({ id: "1", name: "item 1", price: 10 }), 
        new ProductModel({ id: "2", name: "item 2", price: 20 }),
      ],
      total: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {include: [ProductModel]});    

    const invoice = await invoiceRepository.find("1");

    expect(invoice.id.id).toEqual("1");
    expect(invoice.name).toEqual("Invoice 1");
    expect(invoice.document).toEqual("document 1");
    expect(invoice.address.street).toEqual("street 1");
    expect(invoice.address.number).toEqual("000");
    expect(invoice.address.complement).toEqual("apartment 1");
    expect(invoice.address.city).toEqual("city 1");
    expect(invoice.address.state).toEqual("state 1");
    expect(invoice.address.zipCode).toEqual("00000");
    expect(invoice.items).toStrictEqual([
      new Product({ id: new Id("1"), name: "item 1", price: 10 }), 
      new Product({ id: new Id("2"), name: "item 2", price: 20 }),
    ]);
    expect(invoice.total).toEqual(30);
  });

});
