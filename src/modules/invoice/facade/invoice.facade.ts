import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, {
  InvoiceFacadeInputDto,
  InvoiceFacadeOutputDto,
} from "./invoice.facade.interface";

export default class InvoiceFacade implements InvoiceFacadeInterface {
  constructor(private processInvoiceUseCase: UseCaseInterface) {}
  process(input: InvoiceFacadeInputDto): Promise<InvoiceFacadeOutputDto> {
    return this.processInvoiceUseCase.execute(input);
  }
}
