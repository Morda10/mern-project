import { Appointment } from "models/Appointment/appointmentTypes";
import { ObjectId } from "mongoose";
import { User } from "../User/userTypes";

export interface Owner {
  _id: ObjectId;
  user: User;
  scheduledAppointments: Appointment[];
  archive: Appointment[];
  availableDays: enum;
}

const oOoO = {
  fromTo: [
    {
      date: [Date.now()],
      hours: ["10:00-10:15", "10:15-10:30"],
    },
    {
      days: [2],
      hours: [10, 19],
    },
  ],
};
//table owner -  avilable-days : enum days, avilable-hours : date.hours, blocked-hours-date : date ,
//return dates list of available hours
