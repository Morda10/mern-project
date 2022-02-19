import mongoose from "mongoose";
import { MODELS } from "../consts";
import { Owner } from "./OwnerTypes";

const Schema = mongoose.Schema;

const OwnerSchema = new Schema<Owner>({
  user: { type: Schema.Types.ObjectId, required: true, ref: MODELS.CUSTOMER },
  scheduledAppointments: [
    { type: Schema.Types.ObjectId, required: true, ref: MODELS.APPOINTMENT },
  ],
  archive: [
    { type: Schema.Types.ObjectId, required: true, ref: MODELS.CUSTOMER },
  ],
});

module.exports = mongoose.model(MODELS.CUSTOMER, OwnerSchema);
