//3rd IMPORT
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";

//ROUTES IMPORT
import authRoutes from "./routes/auth/auth";
import userRoutes from "./routes/user/user";
import appointmentRoutes from "./routes/appointment/appointment";
import authController from "./controllers/auth/authController";
import { BASE_ROUTES, RATE_LIMIT } from "./utils/consts";
import { routeNotFound } from "./utils/routeNotFound";
import { AppError } from "./utils/appError";
import { globalErrorHandler } from "./controllers/errorController";

//Conf USE
const app = express();
dotenv.config({ path: "./config.env" });

//GLOBAL MIDLLEWARES
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(authController.protect);
app.use(RATE_LIMIT);
if (process.env.IS_PRODUCTION === "true") {
  app.use(morgan("dev"));
  app.use(helmet());
}

//ROUTES
app.use(BASE_ROUTES.AUTH, authRoutes);
app.use(BASE_ROUTES.USER, userRoutes);
app.use(BASE_ROUTES.APPOINTMENT, appointmentRoutes);
app.all("*", routeNotFound);
app.use(globalErrorHandler);
//DB CONNECT AND  START SERVER
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
