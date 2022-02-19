import { ObjectId } from "mongoose";

export interface emailVerify {
  _id: ObjectId;
  email: string;
  verifcationCode: string;
  createdAt: Date;
}
