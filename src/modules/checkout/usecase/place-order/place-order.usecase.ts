import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {
    private _clientFacade: ClientAdmFacadeInterface;

    constructor(clientFacade: ClientAdmFacadeInterface) {
        this._clientFacade = clientFacade;
    }

    async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
        // buscar o cliente. Caso nao encontre -> client not found
        const client = await this._clientFacade.find({ id: input.clientId });
        if (!client) {
            throw new Error("Client not found");
        }

        // validar produto.
        await this.validateProducts(input);
        // recuperar os produtos

        // criar o objeto do client
        // criar o objeto da order (client, products)

        // processpayment -> paymentfacade.process (orderid, amount)

        // caso o pagamento seja aprovado. -> Gerar invoice
        // mudar o status da minha order para approved
        // retornar dto

        return {
            id: "",
            invoiceId: "",
            status: "",
            total: 0,
            products: [],
        }
        
    }

    private async validateProducts(input: PlaceOrderInputDto): Promise<void> {
        if (input.products.length === 0) {
            throw new Error("No products selected");
        }
    }
}