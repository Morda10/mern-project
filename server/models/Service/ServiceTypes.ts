import { ObjectId } from "mongoose";

export interface Service {
  _id: ObjectId;
  name: string;
  price: number;
  description?: string;
  duration: number;
}
