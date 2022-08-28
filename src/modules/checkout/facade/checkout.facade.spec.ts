import { Sequelize } from "sequelize-typescript";
import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";
import { ClientModel } from "../../client-adm/repository/client.model";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import { ProductModel } from "../../product-adm/repository/product.model";
import CheckoutFacadeFactory from "../factory/checkout.facade.factory";
import { OrderModel } from "../../checkout/repository/order.model";
import { ProductModel as InvoiceProductModel } from "../../invoice/repository/product.model";
import { ProductModel as StoreProductModel } from "../../store-catalog/repository/product.model";
import { ProductModel as CheckoutProductModel } from "../../checkout/repository/product.model";
import { ClientModel as CheckoutClientModel } from "../../checkout/repository/client.model";
import { InvoiceModel } from "../../invoice/repository/invoice.model";
import TransactionModel from "../../payment/repository/transaction.model";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Product from "../domain/product.entity";
import Order from "../domain/order.entity";
import CheckoutRepository from "../repository/checkout.repository";

describe("CheckoutFacade test", () => {
  let productSequelize: Sequelize;
  let clientSequelize: Sequelize;
  let storeSequelize: Sequelize;
  let paymentSequelize: Sequelize;
  let invoiceSequelize: Sequelize;
  let checkoutSequelize: Sequelize;
  
  beforeEach(async () => {
    // PRODUCT DB
    productSequelize = new Sequelize({
      database: 'product_db', dialect: "sqlite", storage: ":memory:", logging: false, sync: { force: true },});  
    productSequelize.addModels([ProductModel]);
    await productSequelize.sync(); //.then(() => {console.log("Synced Product db.");})
      //.catch((err) => {console.log("Failed to sync Product db: " + err.message);});

    // CLIENT DB
    clientSequelize = new Sequelize({
      database: 'client_db', dialect: "sqlite", storage: ":memory:", logging: false, sync: { force: true },});
    clientSequelize.addModels([ClientModel]);
    await clientSequelize.sync(); //.then(() => {console.log("Synced Client db.");})
      //.catch((err) => {console.log("Failed to sync Client db: " + err.message);});

    // STORE CATALOG DB  
    storeSequelize = new Sequelize({
      database: 'store_db', dialect: "sqlite", storage: ":memory:", logging: false, sync: { force: true },});
    storeSequelize.addModels([StoreProductModel]);
    await storeSequelize.sync(); //.then(() => {console.log("Synced Store db.");})
      //.catch((err) => {console.log("Failed to sync Store db: " + err.message);});      

    // PAYMENT DB
    paymentSequelize = new Sequelize({
      database: 'payment_db', dialect: "sqlite", storage: ":memory:", logging: false, sync: { force: true },});
    paymentSequelize.addModels([TransactionModel]);
    await paymentSequelize.sync(); //.then(() => {console.log("Synced Payment db.");})
      //.catch((err) => {console.log("Failed to sync Payment db: " + err.message);});      

    // INVOICE DB
    invoiceSequelize = new Sequelize({
      database: 'invoice_db', dialect: "sqlite", storage: ":memory:", logging: false, sync: { force: true },});    
    invoiceSequelize.addModels([InvoiceModel,InvoiceProductModel]);
    await invoiceSequelize.sync(); //.then(() => {console.log("Synced Invoice db.");})
      //.catch((err) => {console.log("Failed to sync Invoice db: " + err.message);});
    
    // CHECKOUT DB
    checkoutSequelize = new Sequelize({
      database: 'checkout_db', dialect: "sqlite", storage: ":memory:", logging: false, sync: { force: true },});
    checkoutSequelize.addModels([OrderModel,CheckoutClientModel,CheckoutProductModel]);
    await checkoutSequelize.sync(); //.then(() => {console.log("Synced Checkout db.");})
      //.catch((err) => {console.log("Failed to sync Checkout db: " + err.message);});    
  });

  afterEach(async () => {
    await productSequelize.close();
    await clientSequelize.close();
    await storeSequelize.close();
    await paymentSequelize.close();
    await invoiceSequelize.close();
    await checkoutSequelize.close();
  });

  it("should place a order", async () => {
    const clientProps = {
      id: "1c",
      name: "Client 0",
      document: "0000",
      email: "client@user.com",
      street: "some address",
      number: "1",
      complement: "",
      city: "some city",
      state: "some state",
      zipCode: "000",
    };

    const clientFacade = ClientAdmFacadeFactory.create();
    clientFacade.add(clientProps);

    const products = [
      {
          id: "1",
          name: "Product 1",
          description: "some description",
          purchasePrice: 100,
          stock: 10,
      },
      {
          id: "2",
          name: "Product 2",
          description: "some description 2",
          purchasePrice: 200,
          stock: 10,
      },
    ];

    const productFacade = ProductAdmFacadeFactory.create();
    productFacade.addProduct(products[0]);    
    productFacade.addProduct(products[1]);

    const storeProducts = [
      {
          id: "1",
          name: "Product 1",
          description: "some description",
          salesPrice: 100,
      },
      {
          id: "2",
          name: "Product 2",
          description: "some description 2",
          salesPrice: 200,
      },
    ];

    const storeFacade = StoreCatalogFacadeFactory.create();
    storeFacade.add(storeProducts[0]);
    storeFacade.add(storeProducts[1]);

/*
    const invoice = {
      name: "Invoice 1",
      document: "document 1",
      street: "street 1",
      number: "000",
      complement: "apartment 1",
      city: "city 1",
      state: "state 1",
      zipCode: "00000",
      items: [
        { id: "1", name: "Product 1", price: 10 }, 
        { id: "2", name: "Product 2", price: 20 },
      ],      
    };
    const invoiceFacade = InvoiceFacadeFactory.create();
    const invoiceResult = invoiceFacade.generate(invoice);
*/
    const facade = CheckoutFacadeFactory.create();

    const input = { 
      clientId: "1c", 
      products: [{productId: "1"},{productId: "2"}],
    };

    const result = await facade.placeOrder(input);
/*
    const result = await OrderModel.findOne({ 
      where: { id: "1" },
      include: [ClientModel, ProductModel],
    });
*/
    expect(result).toBeDefined();
    expect(result.status).toEqual("approved");
    expect(result.total).toEqual(300);
    expect(result.products).toStrictEqual([
        {
          productId: input.products[0].productId, 
        },
        { 
          productId: input.products[1].productId, 
        }, 
    ]);
    
  });

  it("should find a order", async () => {
    const facade = CheckoutFacadeFactory.create();

    const input = {
      id: new Id("1"),
      client: new Client({
        id: new Id("1"),
        name: "Client 1",
        email: "x@x.com",
        document: "document 1",  
        street: "street 1",
        number: "000",
        complement: "apartment 1",
        city: "city 1",
        state: "state 1",
        zipCode: "00000",
      }),      
      products: [
        new Product({ id: new Id("1"), name: "item 1", description: "description 1", salesPrice: 10 }), 
        new Product({ id: new Id("2"), name: "item 2", description: "description 2", salesPrice: 20 }),
      ],
      status: "status 1",
    };

    const order = new Order(input);
    const checkoutRepository = new CheckoutRepository();
    await checkoutRepository.addOrder(order);

    const result = await facade.findOrder({ id: "1" });

    expect(result).toBeDefined();
    expect(result.id).toEqual(input.id.id);
    expect(result.client.id).toEqual(input.client.id.id);
    expect(result.client.name).toEqual(input.client.name);
    expect(result.client.email).toEqual(input.client.email);
    expect(result.client.document).toEqual(input.client.document);    
    expect(result.client.street).toEqual(input.client.street);
    expect(result.client.number).toEqual(input.client.number);
    expect(result.client.complement).toEqual(input.client.complement);
    expect(result.client.city).toEqual(input.client.city);
    expect(result.client.state).toEqual(input.client.state);
    expect(result.client.zipCode).toEqual(input.client.zipCode);
    expect(result.products).toStrictEqual([
        {
          id: input.products[0].id.id, 
          name: input.products[0].name,
          description: input.products[0].description, 
          salesPrice: input.products[0].salesPrice,
        },
        { 
          id: input.products[1].id.id, 
          name: input.products[1].name, 
          description: input.products[1].description,
          salesPrice: input.products[1].salesPrice,
        }, 
    ]);
    expect(result.status).toEqual(input.status);  
  });

});
