import { StatusCodes } from 'http-status-codes';
import { Sequelize } from 'sequelize-typescript';
import { FindInvoiceFacadeInputDto, InvoiceFacadeInputDto } from '../modules/invoice/facade/invoice.facade.interface';
import InvoiceFacadeFactory from '../modules/invoice/factory/invoice.facade.factory';
import { InvoiceModel } from '../modules/invoice/repository/invoice.model';
import { ProductModel } from '../modules/invoice/repository/product.model';
import { app } from '../server';

const URL: string = '/invoice';

const invoiceFacade = InvoiceFacadeFactory.create();

let invoiceSequelize = new Sequelize({
    database: 'invoice_db',
    dialect: "sqlite",
    storage: ":memory:",
    logging: true,
    sync: { force: true },
});

invoiceSequelize.addModels([InvoiceModel,ProductModel]);
invoiceSequelize.sync()
.then(() => {
    console.log("Synced Invoice db.");
})
.catch((err) => {
    console.log("Failed to sync Invoice db: " + err.message);
});

app.get(`${URL}/:id`, async (req, res) => {
    const { id }: { id?: string } = req.params
    
    const input: FindInvoiceFacadeInputDto = {
        id: id,
    };

    const obj = await invoiceFacade.find(input);

    if (obj == null) {
        res.status(StatusCodes.NOT_FOUND).json()
    } else {
        res.status(StatusCodes.OK).json(obj)
    }
});

app.post(URL, async (req, res) => {
    const input: InvoiceFacadeInputDto = req.body;

    try {
        await invoiceFacade.generate(input);
        res.status(StatusCodes.CREATED).json();
    } catch (error) {
        res.status(StatusCodes.NOT_FOUND).json({ error: error });
    }
});

//invoiceSequelize.close();
