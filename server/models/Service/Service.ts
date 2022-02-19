import mongoose from "mongoose";
import { MODELS } from "../consts";
import { Service } from "./ServiceTypes";

const Schema = mongoose.Schema;

const serviceSchema = new Schema<Service>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  duration: { type: Number, required: true },
});

module.exports = mongoose.model(MODELS.SERVICE, serviceSchema);
