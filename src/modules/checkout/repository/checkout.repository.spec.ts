import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutRepository from "./checkout.repository";
import { ClientModel } from "./client.model";
import { OrderModel } from "./order.model";
import { ProductModel } from "./product.model";

describe("CheckoutRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([OrderModel,ClientModel,ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should add a order", async () => {
    const OrderProps = {
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

    const order = new Order(OrderProps);
    const checkoutRepository = new CheckoutRepository();
    await checkoutRepository.addOrder(order);

    const checkoutDb = await OrderModel.findOne({
      where: { id: OrderProps.id.id },
      include: [ClientModel,ProductModel],
    });

    expect(OrderProps.id.id).toEqual(checkoutDb.id);
    expect(OrderProps.client.id.id).toEqual(checkoutDb.client.id);
    expect(OrderProps.client.name).toEqual(checkoutDb.client.name);
    expect(OrderProps.client.email).toEqual(checkoutDb.client.email);
    expect(OrderProps.client.document).toEqual(checkoutDb.client.document);    
    expect(OrderProps.client.street).toEqual(checkoutDb.client.street);
    expect(OrderProps.client.number).toEqual(checkoutDb.client.number);
    expect(OrderProps.client.complement).toEqual(checkoutDb.client.complement);
    expect(OrderProps.client.city).toEqual(checkoutDb.client.city);
    expect(OrderProps.client.state).toEqual(checkoutDb.client.state);
    expect(OrderProps.client.zipCode).toEqual(checkoutDb.client.zipCode);
    expect(OrderProps.products).toStrictEqual([
        new Product({ 
          id: new Id(checkoutDb.products[0].id), 
          name: checkoutDb.products[0].name,
          description: checkoutDb.products[0].description, 
          salesPrice: checkoutDb.products[0].salesPrice,
        }), 
        new Product({ 
          id: new Id(checkoutDb.products[1].id), 
          name: checkoutDb.products[1].name, 
          description: checkoutDb.products[1].description,
          salesPrice: checkoutDb.products[1].salesPrice,
        }), 
    ]);
    expect(OrderProps.status).toEqual(checkoutDb.status);
  });

  it("should find a order", async () => {
    const checkoutRepository = new CheckoutRepository();

    await OrderModel.create({
      id: "1",
      client: new ClientModel({
        id: "1",
        name: "Client 1",
        email: "x@x.com",
        document: "document 1",  
        street: "street 1",
        number: "000",
        complement: "apartment 1",
        city: "city 1",
        state: "state 1",
        zipCode: "00000",
        createdAt: new Date(),
        updatedAt: new Date(),  
        orderId: "1",
      }),      
      products: [
        new ProductModel({ id: "1", name: "item 1", description: "description 1", salesPrice: 10, orderId: "1" }), 
        new ProductModel({ id: "2", name: "item 2", description: "description 2", salesPrice: 20, orderId: "1" }),
      ],
      status: "status 1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {include: [ClientModel,ProductModel]});    

    const checkout = await checkoutRepository.findOrder("1");

    expect(checkout.id.id).toEqual("1");
    expect(checkout.client.name).toEqual("Client 1");
    expect(checkout.client.email).toEqual("x@x.com");
    expect(checkout.client.document).toEqual("document 1");  
    expect(checkout.client.street).toEqual("street 1");
    expect(checkout.client.number).toEqual("000");
    expect(checkout.client.complement).toEqual("apartment 1");
    expect(checkout.client.city).toEqual("city 1");
    expect(checkout.client.state).toEqual("state 1");
    expect(checkout.client.zipCode).toEqual("00000");
    expect(checkout.products).toStrictEqual([
      new Product({ id: new Id("1"), name: "item 1", description: "description 1", salesPrice: 10 }), 
      new Product({ id: new Id("2"), name: "item 2", description: "description 2", salesPrice: 20 }),
    ]);
    expect(checkout.status).toEqual("status 1");
  });

});
