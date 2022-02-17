import { ObjectId } from "mongoose";
import { User } from "./userTypes";

export interface Appointment {
  _id: ObjectId;
  customer: User;
  owner: User;
  appointmentDetails?: AppointmentDetails;
}

export interface AppointmentDetails {
  appointmentName: string;
  appointmentDate: Date;
  price: number;
  appointmentDescription?: string;
}
