import mongoose from "mongoose";
import { emailVerify } from "./types/emailVerifyType";

const Schema = mongoose.Schema;

const emailVerifySchema = new Schema<emailVerify>({
  email: { type: String, required: true },
  verifcationCode: { type: String, required: true },
});

export default mongoose.model("emailVerify", emailVerifySchema);
