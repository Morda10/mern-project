import { ObjectId, SchemaDefinitionProperty } from "mongoose";


export interface User {
    _id: ObjectId;
    username: string;
    email: string;
    password: string;
    phoneNumber: string;
    firstName:string;
    lastName:string;
    role:SchemaDefinitionProperty<Roles> | undefined;
    isActive:boolean;
    verifcationCode:string;
};

export enum Roles { ADMIN, OWNER, CUSTOMER};