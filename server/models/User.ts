import mongoose from 'mongoose';
import { User } from './types/userTypes';

const Schema = mongoose.Schema;

const userSchema = new Schema<User>({
    username: {  type: String, required: true },
    email: {  type: String, required: true },
    password: {  type: String, required: true },
    phoneNumber: {  type: String, required: true },
    firstName: {type : String, required: true},
    lastName:{type : String, required: true},
    role : {type :String,enum:['ADMIN', 'OWNER', 'CUSTOMER'], default:'CUSTOMER' ,required: true},
    isActive : { type : Boolean ,default : false},
    verifcationCode : { type : String }
});
 
export default mongoose.model('User', userSchema);
// module.exports = mongoose.model('User', userSchema)
