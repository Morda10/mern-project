import mongoose from 'mongoose';
import { MODELS } from './consts';
import { Appointment } from './types/appointmentTypes';

const Schema = mongoose.Schema;

const appointmentSchema = new Schema<Appointment>({
    date: { type: Date, required: true },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: MODELS.USER
    }
});

module.exports = mongoose.model(MODELS.APPOINTMENT, appointmentSchema);
