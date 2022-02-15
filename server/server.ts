//3rd IMPORT
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

//ROUTES IMPORT
import authRoutes from "./routes/auth/auth";
import userRoutes from "./routes/user/user";

//Utils IMPORT
import authorizationCheck from "./utils/authorizationCheck";

//Conf USE
const app = express();
dotenv.config({ path: "./config.env" });

//GLOBAL MIDLLEWARES
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

//ROUTES
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

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
