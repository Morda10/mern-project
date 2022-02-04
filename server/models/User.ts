import mongoose from 'mongoose';
import { User } from './types/userTypes';

const Schema = mongoose.Schema;

const userSchema = new Schema<User>({
    username: {  type: String, required: true },
    email: {  type: String, required: true },
    password: {  type: String, required: true },
    address: {  type: String, required: true },
    phoneNumber: {  type: String },
    paymentMethod: {  type: String },
});

module.exports = mongoose.model('User', userSchema)
