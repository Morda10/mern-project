import mongoose from "mongoose";
import { Token } from "./resetPasswordTokenType";
const Schema = mongoose.Schema;
const tokenSchema = new Schema<Token>({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // this is the expiry time in seconds
  },
});
export default mongoose.model("Token", tokenSchema);
