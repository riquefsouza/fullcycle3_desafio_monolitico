import { StatusCodes } from "http-status-codes";
import { Sequelize } from "sequelize-typescript";
import StoreCatalogFacadeFactory from "../modules/store-catalog/factory/facade.factory";
import { ProductModel } from "../modules/store-catalog/repository/product.model";
import { AddProductInputDto } from "../modules/store-catalog/usecase/add-product/add-product.dto";
import { app } from "../server";

const URL: string = '/store';

const storeFacade = StoreCatalogFacadeFactory.create();

let storeSequelize = new Sequelize({
    database: 'store_db',
    dialect: "sqlite",
    storage: ":memory:",
    logging: true,
    sync: { force: true },
});

storeSequelize.addModels([ProductModel]);
storeSequelize.sync()
.then(() => {
    console.log("Synced Store db.");
})
.catch((err) => {
    console.log("Failed to sync Store db: " + err.message);
});
  
app.post(URL, async (req, res) => {
    const input: AddProductInputDto = req.body;

    try {
        await storeFacade.add(input);
        res.status(StatusCodes.CREATED).json();
    } catch (error) {
        res.status(StatusCodes.NOT_FOUND).json({ error: error });
    }
});

app.get(`${URL}/:id`, async (req, res) => {
    const { id }: { id?: string } = req.params
    const result = await storeFacade.find({ id });
    res.status(StatusCodes.OK).json(result);
});

//storeSequelize.close();