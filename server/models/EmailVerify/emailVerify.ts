import mongoose from "mongoose";
import { EMAIL_VERIFY_EXPIRATION, MODELS } from "../consts";
import { emailVerify } from "./emailVerifyType";

const Schema = mongoose.Schema;

const emailVerifySchema = new Schema<emailVerify>({
  email: { type: String, required: true },
  verifcationCode: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: EMAIL_VERIFY_EXPIRATION, // this is the expiry time in seconds
  },
});

export default mongoose.model(MODELS.EMAIL_VERIFY, emailVerifySchema);
