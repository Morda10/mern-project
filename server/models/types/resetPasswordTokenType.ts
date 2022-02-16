import { ObjectId, SchemaDefinitionProperty } from "mongoose";

export interface Token {
  _id: ObjectId;
  token: string;
  createdAt: Date;
}
