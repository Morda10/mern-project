import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

const app = express();

dotenv.config({ path: "./config.env" });

import adminRoutes from "./routes/admin";
import shopRoutes from "./routes/admin";
// import userRoutes from 'routes/user';
import authRoutes from "./routes/auth/auth";
import authorizationCheck from "./utils/authorizationCheck";

//GLOBAL MIDLLEWARES
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(async (_req, res, next) => {
  if (!(await authorizationCheck.checkRequest(_req)))
    res.status(401).json({ msg: "No Authorization!" });
  else next();
});

//ROUTES
app.use("/auth", authRoutes);
app.use("/", (_req, res, next) => {
  console.log({ __dirname });
  res.json({ status: "success" });
  next();
});

//START DB CONNECT AND SERVER
const DB = process.env.DB_CONNECTION_STRING?.replace(
  "<PASSWORD>",
  process.env.DB_PASSWORD!
);
mongoose
  .connect(DB!)
  .then(() => {
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });
