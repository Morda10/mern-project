import { ObjectId } from "mongoose";


export interface User {
    _id: ObjectId;
    username: string;
    email: string;
    password: string;
    address: string;
    phoneNumber?: string;
    paymentMethod?: string;
};