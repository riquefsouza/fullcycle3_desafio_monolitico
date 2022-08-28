import express from 'express';
//import cors from 'cors';
export const app = express();

app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
/*
const corsOptions = {
  exposedHeaders: ['x-access-token']
};
app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))
*/

import './controllers/productController';
import './controllers/clientController';
import './controllers/storeController';
import './controllers/invoiceController';
import './controllers/checkoutController';

app.use('*', (req, res) => {
  res.status(404).json({ message: `route ${req.originalUrl} does not exists!` });
});

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});


const server = app.listen(3000, () => {
    console.log('Server ready at: http://localhost:3000');
});


