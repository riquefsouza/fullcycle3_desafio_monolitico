import InvoiceFacade from "../facade/invoice.facade";
import InvoiceRepository from "../repository/invoice.repository";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";

export default class InvoiceFacadeFactory {
  static create() {
    const invoiceRepository = new InvoiceRepository();
    const createInvoiceUseCase = new GenerateInvoiceUseCase(invoiceRepository);
    const findInvoiceUseCase = new FindInvoiceUseCase(invoiceRepository);
    const invoiceFacade = new InvoiceFacade({
      createUseCase: GenerateInvoiceUseCase,
      findUseCase: findInvoiceUseCase,
    });

    return invoiceFacade;
  }
}