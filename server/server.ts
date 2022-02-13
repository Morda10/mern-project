import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();

import adminRoutes from "./routes/admin";
import shopRoutes from "./routes/admin";
// import userRoutes from 'routes/user';
import authRoutes from "./routes/auth/auth";

//GLOBAL MIDLLEWARES
app.use(express.json({ limit: "10kb" }));
app.use(bodyParser.urlencoded({ extended: false }));

//ROUTES
app.use("/auth", authRoutes);
// app.use('shop', shopRoutes);
app.use("/", (_req, res, next) => {
  console.log({ __dirname });
  res.json({ status: "success" });
  next();
});

//START DB CONNECT AND SERVER
mongoose
  .connect(
    "mongodb+srv://mor:mor@cluster0.ma0wp.mongodb.net/Appointments?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
