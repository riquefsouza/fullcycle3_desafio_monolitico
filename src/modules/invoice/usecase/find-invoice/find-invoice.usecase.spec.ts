import Address from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice.entity";
import Product from "../../domain/product.entity";
import FindInvoiceUseCase from "./find-invoice.usecase";

const invoice = new Invoice({
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
});

const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
  };
};

describe("Find Invoice Usecase unit test", () => {
  it("should find a invoice", async () => {
    const repository = MockRepository();
    const usecase = new FindInvoiceUseCase(repository);

    const input = {
      id: "1",
    };

    const result = await usecase.execute(input);

    expect(repository.find).toHaveBeenCalled();
    expect(result.id).toEqual(input.id);
    expect(result.name).toEqual(invoice.name);
    expect(result.document).toEqual(invoice.document);
    expect(result.address).toEqual(invoice.address);
    expect(result.items).toStrictEqual([
      new Product({ id: new Id("1"), name: "item 1", price: 10 }), 
      new Product({ id: new Id("2"), name: "item 2", price: 20 }),
    ]);

  });
});
