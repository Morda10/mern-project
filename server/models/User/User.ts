import { USER_ROLES } from "../../controllers/user/consts";
import mongoose from "mongoose";
import { MODELS } from "../consts";
import { User } from "./userTypes";

const Schema = mongoose.Schema;

const userSchema = new Schema<User>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: {
    type: String,
    enum: [USER_ROLES.ADMIN, USER_ROLES.OWNER, USER_ROLES.CUSTOMER],
    default: USER_ROLES.CUSTOMER,
    required: true,
  },
  isActive: { type: Boolean, default: true },
});

export default mongoose.model(MODELS.USER, userSchema);
