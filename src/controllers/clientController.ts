import { StatusCodes } from 'http-status-codes';
import { Sequelize } from 'sequelize-typescript';
import { AddClientFacadeInputDto } from '../modules/client-adm/facade/client-adm.facade.interface';
import ClientAdmFacadeFactory from '../modules/client-adm/factory/client-adm.facade.factory';
import { ClientModel } from '../modules/client-adm/repository/client.model';
import { app } from '../server';

const URL: string = '/clients';

const clientFacade = ClientAdmFacadeFactory.create();

let clientSequelize = new Sequelize({
    database: 'client_db',
    dialect: "sqlite",
    storage: ":memory:",
    logging: true,
    sync: { force: true },
});

clientSequelize.addModels([ClientModel]);
clientSequelize.sync()
.then(() => {
    console.log("Synced Client db.");
})
.catch((err) => {
    console.log("Failed to sync Client db: " + err.message);
});

app.post(URL, async (req, res) => {
    const input: AddClientFacadeInputDto = req.body;

    try {
        await clientFacade.add(input);
        res.status(StatusCodes.CREATED).json();
    } catch (error) {
        res.status(StatusCodes.NOT_FOUND).json({ error: error });
    }

});

app.get(`${URL}/:id`, async (req, res) => {
    const { id }: { id?: string } = req.params
    const result = await clientFacade.find({ id });
    res.status(StatusCodes.OK).json(result);
});

//clientSequelize.close();