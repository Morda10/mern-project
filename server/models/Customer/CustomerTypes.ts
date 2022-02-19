import { Appointment } from "models/Appointment/appointmentTypes";
import { ObjectId } from "mongoose";
import { User } from "../User/userTypes";
import { ArchiveAppointment } from "../ArchiveAppointment/ArchiveAppointmentTypes";
export interface Customer {
  _id: ObjectId;
  user: User;
  scheduledAppointments: Appointment[];
  archive: ArchiveAppointment[];
}
