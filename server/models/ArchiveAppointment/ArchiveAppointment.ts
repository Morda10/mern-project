import mongoose from "mongoose";
import { MODELS } from "../consts";
import { ArchiveAppointment } from "./ArchiveAppointmentTypes";

const Schema = mongoose.Schema;

const appointmentSchema = new Schema<ArchiveAppointment>({
  customer: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: MODELS.USER,
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: MODELS.USER,
  },
  service: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: MODELS.SERVICE,
  },
  date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model(MODELS.APPOINTMENT, appointmentSchema);
