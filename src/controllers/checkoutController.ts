import { StatusCodes } from 'http-status-codes';
import { Sequelize } from 'sequelize-typescript';
import { CheckoutFacadeInputDto } from '../modules/checkout/facade/checkout.facade.interface';
import CheckoutFacadeFactory from '../modules/checkout/factory/checkout.facade.factory';
import { ClientModel } from '../modules/checkout/repository/client.model';
import { OrderModel } from '../modules/checkout/repository/order.model';
import { ProductModel } from '../modules/checkout/repository/product.model';
import TransactionModel from '../modules/payment/repository/transaction.model';
import { app } from '../server';

const URL: string = '/checkout';

const checkoutFacade = CheckoutFacadeFactory.create();

let checkoutSequelize = new Sequelize({
    database: 'checkout_db',
    dialect: "sqlite",
    storage: ":memory:",
    logging: true,
    sync: { force: true },
});

checkoutSequelize.addModels([OrderModel,ClientModel,ProductModel,TransactionModel]);
checkoutSequelize.sync()
.then(() => {
    console.log("Synced Checkout db.");
})
.catch((err) => {
    console.log("Failed to sync Checkout db: " + err.message);
});

app.post(URL, async (req, res) => {
    const input: CheckoutFacadeInputDto = req.body;
    try {
        let output = await checkoutFacade.placeOrder(input);
        res.status(StatusCodes.CREATED).json(output);
    } catch (error) {
        res.status(StatusCodes.NOT_FOUND).json({ error: error });
    }
});

app.get(`${URL}/:id`, async (req, res) => {
    const { id }: { id?: string } = req.params
    const result = await checkoutFacade.findOrder({ id });
    res.status(StatusCodes.OK).json(result);
});

//checkoutSequelize.close();
