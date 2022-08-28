import CheckoutGateway from "../../gateway/checkout.gateway";
import {
  FindOrderInputDto,
  FindOrderOutputDto,
} from "./find-order.usecase.dto";

export default class FindOrderUseCase {
  private _orderRepository: CheckoutGateway;

  constructor(orderRepository: CheckoutGateway) {
    this._orderRepository = orderRepository;
  }

  async execute(input: FindOrderInputDto): Promise<FindOrderOutputDto> {
    const order = await this._orderRepository.findOrder(input.id);

    return {
      id: order.id.id,
      client: {
        id: order.client.id.id,
        name: order.client.name,
        email: order.client.email,
        document: order.client.document,
        street: order.client.street,
        number: order.client.number,
        complement: order.client.complement,
        city: order.client.city,
        state: order.client.state,
        zipCode: order.client.zipCode,
      },
      products: order.products.map((item) => ({
          id: item.id.id,
          name: item.name,
          description: item.description,
          salesPrice: item.salesPrice,
      })),
      status: order.status,
      createdAt: order.createdAt,
    };
  }
}
