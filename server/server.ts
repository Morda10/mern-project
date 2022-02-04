import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const app = express();

import adminRoutes from './routes/admin';
import shopRoutes from "./routes/shop";
import userRoutes from "./routes/user";


app.use(bodyParser.urlencoded({ extended: false }));

app.use('admin', adminRoutes);
app.use('shop', shopRoutes);

app.use('/', (_req, res, next) => {
    console.log("server is liveeee!!!");
    res.send("<h1>godlsnghdf</h1>");
    next();
}); 

mongoose
  .connect(
    'mongodb+srv://mor:mor@cluster0.ma0wp.mongodb.net/Appointments?retryWrites=true&w=majority'
  )
  .then(() => {
    app.listen(8080);
  })
  .catch(err => {
    console.log(err);
  });
