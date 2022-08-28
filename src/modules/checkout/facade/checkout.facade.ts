import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import CheckoutFacadeInterface, 
{ CheckoutFacadeInputDto, 
  CheckoutFacadeOutputDto, 
  FindCheckoutFacadeInputDto, 
  FindCheckoutFacadeOutputDto} from "./checkout.facade.interface";

export interface UseCaseProps {
  findUsecase: UseCaseInterface;
  placeOrderUsecase: UseCaseInterface;
}

export default class CheckoutFacade implements CheckoutFacadeInterface {
  private _findUsecase: UseCaseInterface;
  private _placeOrderUsecase: UseCaseInterface;

  constructor(usecaseProps: UseCaseProps) {
    this._findUsecase = usecaseProps.findUsecase;
    this._placeOrderUsecase = usecaseProps.placeOrderUsecase;
  }

  placeOrder(input: CheckoutFacadeInputDto): Promise<CheckoutFacadeOutputDto> {
    return this._placeOrderUsecase.execute(input);
  }
  findOrder(input: FindCheckoutFacadeInputDto): Promise<FindCheckoutFacadeOutputDto>{
    return this._findUsecase.execute(input);
  }

}
