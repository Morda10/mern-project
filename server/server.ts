import express from 'express';
import bodyParser from 'body-parser';

const app = express();

import adminRoutes from './routes/admin';
import shopRoutes from "./routes/shop";


app.use(bodyParser.urlencoded({ extended: false }));

app.use('admin', adminRoutes);
app.use('shop', shopRoutes);

app.use('/', (_req, res, next) => {
    console.log("server is liveeee!!!");
    res.send("<h1>godlsnghdf</h1>");
    next();
}); 

app.listen(8080);
