import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, {
  FindInvoiceFacadeInputDto,
  InvoiceFacadeInputDto,
  InvoiceFacadeOutputDto,
} from "./invoice.facade.interface";

export interface UseCaseProps {
  findUsecase: UseCaseInterface;
  createUsecase: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
  private _findUsecase: UseCaseInterface;
  private _createUsecase: UseCaseInterface;

  constructor(usecaseProps: UseCaseProps) {
    this._findUsecase = usecaseProps.findUsecase;
    this._createUsecase = usecaseProps.createUsecase;
  }

  async create(input: InvoiceFacadeInputDto): Promise<InvoiceFacadeOutputDto> {
    return await this._createUsecase.execute(input);
  }
  async find(input: FindInvoiceFacadeInputDto): Promise<InvoiceFacadeOutputDto>{
    return await this._findUsecase.execute(input);
  }

}
