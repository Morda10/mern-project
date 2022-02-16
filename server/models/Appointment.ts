import mongoose from 'mongoose';
import { MODELS } from './consts';
import { Appointment } from './types/appointmentTypes';

const Schema = mongoose.Schema;

const appointmentSchema = new Schema<Appointment>({
    appointmentDetails: {
        appointmentName: { type: String, required: true },
        appointmentDate: { type: Date, required: true },
        price: { type: Number, required: true },
        appointmentDescription: { type: String, required: true }
    },
    customer: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: MODELS.USER
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: MODELS.USER
    },
});

module.exports = mongoose.model(MODELS.APPOINTMENT, appointmentSchema);
