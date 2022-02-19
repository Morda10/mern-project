import { Service } from "../Service/ServiceTypes";
import { ObjectId } from "mongoose";
import { User } from "../User/userTypes";

export interface Appointment {
  _id: ObjectId;
  customer: User;
  owner: User;
  service: Service;
  date: Date;
}

//owner avilable days
//sundy-thusday 8-18
//table owner - owner:user ref, avilable-days : enum days, avilable-hours : date.hours, blocked-hours-date : date , archive : appointmant ref

//table customer - customer : user ref, sceduale : appointmant, archive : appointmant ref

//owner - appointmant : customer

//archiveAppointment - appointment

//product - owner : Owner, profuct details : {product name: string, product description:strign, price: number, duration:number}
//maybe switch AppointmentDetails with product
