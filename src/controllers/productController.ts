import { StatusCodes } from 'http-status-codes';
import { AddProductFacadeInputDto } from '../modules/product-adm/facade/product-adm.facade.interface';
import ProductAdmFacadeFactory from '../modules/product-adm/factory/facade.factory';
import { app } from '../server';
import { Sequelize } from 'sequelize-typescript';
import { ProductModel } from '../modules/product-adm/repository/product.model';

const URL: string = '/products';

const productFacade = ProductAdmFacadeFactory.create();

let productSequelize = new Sequelize({
    database: 'product_db',
    dialect: "sqlite",
    storage: ":memory:",
    logging: true,
    sync: { force: true },
});

productSequelize.addModels([ProductModel]);
productSequelize.sync()
.then(() => {
    console.log("Synced Product db.");
})
.catch((err) => {
    console.log("Failed to sync Product db: " + err.message);
});
  
app.post(URL, async (req, res) => {
    const input: AddProductFacadeInputDto = req.body;

    try {
        await productFacade.addProduct(input);
        res.status(StatusCodes.CREATED).json();
    } catch (error) {
        res.status(StatusCodes.NOT_FOUND).json({ error: error });
    }
});

app.get(`${URL}/:id`, async (req, res) => {
    const { id }: { id?: string } = req.params
    const result = await productFacade.checkStock({ productId: id });
    res.status(StatusCodes.OK).json(result);
});

//productSequelize.close();