import { Sequelize } from "sequelize-typescript";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";
import { InvoiceModel } from "../repository/invoice.model";
import InvoiceRepository from "../repository/invoice.repository";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import InvoiceFacade from "./invoice.facade";

describe("InvoiceFacade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a invoice", async () => {
    const repository = new InvoiceRepository();
    const createUsecase = new GenerateInvoiceUseCase(repository);
    const facade = new InvoiceFacade({
      createUsecase: createUsecase,
      findUsecase: undefined,
    });

    const input = {
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
        { id: "1", name: "item 1", price: 10 }, 
        { id: "2", name: "item 2", price: 20 },
      ],      
    };    

    await facade.create(input);

    const invoice = await InvoiceModel.findOne({ where: { id: "1" } });

    expect(invoice).toBeDefined();
    expect(invoice.name).toBe(input.name);
    expect(invoice.document).toEqual(input.document);
    expect(invoice.street).toEqual(input.street);
    expect(invoice.number).toEqual(input.number);
    expect(invoice.complement).toEqual(input.complement);
    expect(invoice.city).toEqual(input.city);
    expect(invoice.state).toEqual(input.state);
    expect(invoice.zipCode).toEqual(input.zipCode);
    expect(invoice.items).toStrictEqual([
      { id: "1", name: "item 1", price: 10 }, 
      { id: "2", name: "item 2", price: 20 },
    ]);    
  });

  it("should find a invoice", async () => {
    const facade = InvoiceFacadeFactory.create();

    const input = {
      id: "1",
      name: "Invoice 1",
      email: "x@x.com",
      document: "Address 1",
      street: "Street 1",
      number: "000",
      complement: "apartment 1",
      city: "city 1",
      state: "state 1",
      zipCode: "00000",
      items: [
        { id: "1", name: "item 1", price: 10 }, 
        { id: "2", name: "item 2", price: 20 },
      ], 
    };

    await facade.create(input);

    const invoice = await facade.find({ id: "1" });

    expect(invoice).toBeDefined();
    expect(invoice.id).toBe(input.id);
    expect(invoice.name).toBe(input.name);
    expect(invoice.document).toBe(input.document);
    expect(invoice.street).toBe(input.street);
    expect(invoice.number).toBe(input.number);
    expect(invoice.complement).toBe(input.complement);
    expect(invoice.city).toBe(input.city);
    expect(invoice.state).toBe(input.state);
    expect(invoice.zipCode).toBe(input.zipCode);
    expect(invoice.items).toStrictEqual([
      { id: "1", name: "item 1", price: 10 }, 
      { id: "2", name: "item 2", price: 20 },
    ]);    
  });
});
