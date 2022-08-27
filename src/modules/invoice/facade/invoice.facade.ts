import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, {
  FindInvoiceFacadeInputDto,
  InvoiceFacadeInputDto,
  InvoiceFacadeOutputDto,
} from "./invoice.facade.interface";

export interface UseCaseProps {
  findUsecase: UseCaseInterface;
  generateUsecase: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
  private _findUsecase: UseCaseInterface;
  private _generateUsecase: UseCaseInterface;

  constructor(usecaseProps: UseCaseProps) {
    this._findUsecase = usecaseProps.findUsecase;
    this._generateUsecase = usecaseProps.generateUsecase;
  }

  generate(input: InvoiceFacadeInputDto): Promise<InvoiceFacadeOutputDto> {
    return this._generateUsecase.execute(input);
  }
  find(input: FindInvoiceFacadeInputDto): Promise<InvoiceFacadeOutputDto>{
    return this._findUsecase.execute(input);
  }

}
