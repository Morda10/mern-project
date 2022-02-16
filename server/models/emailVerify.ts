import mongoose from "mongoose";
import { emailVerify } from "./types/emailVerifyType";

const Schema = mongoose.Schema;

const emailVerifySchema = new Schema<emailVerify>({
  email: { type: String, required: true },
  verifcationCode: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // this is the expiry time in seconds
  },
});

export default mongoose.model("emailVerify", emailVerifySchema);
