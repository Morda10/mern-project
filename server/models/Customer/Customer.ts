import mongoose from "mongoose";
import { MODELS } from "../consts";
import { Customer } from "./CustomerTypes";

const Schema = mongoose.Schema;

const CustomerSchema = new Schema<Customer>({
  user: { type: Schema.Types.ObjectId, required: true, ref: MODELS.CUSTOMER },
  scheduledAppointments: [
    { type: Schema.Types.ObjectId, required: true, ref: MODELS.APPOINTMENT },
  ],
  archive: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: MODELS.ARCHIVE_APPOINTMENT,
    },
  ],
});

module.exports = mongoose.model(MODELS.CUSTOMER, CustomerSchema);
