import express from 'express';
import bootstrap from './app.controller.js';
import dotenv from 'dotenv';


const app = express();
dotenv.config({ path: './src/config/.env' });


await bootstrap(app, express);
const port = 3000

app.listen(port, () => console.log(`Example app listening on port ${port}!`))