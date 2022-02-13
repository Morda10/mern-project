import bcrypt from "bcrypt";
import User from "../models/User";
import express from "express";
import { validationResult } from "express-validator";
import { isErrors } from "../utils/IsErrorsOnValidation";
import { sendEmail } from "../utils/email";
import emailVerify from "../models/emailVerify";

const signup = async (req: express.Request, res: express.Response) => {
  //check validation errors
  const errors = isErrors(req, true);
  if (errors) return res.status(400).json({ msg: errors });

  const { password, username, email, phoneNumber } = req.body;

  //password encrypt
  const hashPassword = await bcrypt.hash(password, 12).then((hash) => hash);

  //check if username is already exist
  const userExist = await User.findOne({ username: username });
  if (userExist) {
    return res.status(400).json({ message: `${username} already exist!` });
  }

  //check if email is already exist
  const emailExist = await User.findOne({ email: email });
  if (emailExist)
    return res.status(400).json({ message: `${email} already exist!` });

  //checl if phone is already exist
  const phoneExist = await User.findOne({ phoneNumber: phoneNumber });
  if (phoneExist)
    return res.status(400).json({ message: `${phoneNumber} already exist!` });

  //after all validation success create the user
  await User.create({
    ...req.body,
    password: hashPassword,
  });

  //generate new veridaction code
  const verifcationCode = Math.random().toString(36).substring(2, 8);

  //create the email and verifaction code key value pair in verifyEmail table
  await emailVerify.create({
    email: email,
    verifcationCode: verifcationCode,
  });

  //send verifaction email to the customer
  const msg = `For Email verification enter to this link http://walla.co.il and insert this code ${verifcationCode}`;
  sendEmail(email, "Email verification", msg);

  //return success status
  return res.status(201).json({ message: "user created", data: req.body });
};

const verifyEmail = async (req: express.Request, res: express.Response) => {
  //check validation errors
  const errors = isErrors(req, true);
  if (errors) return res.status(400).json({ msg: errors });

  const { email, verifcationCode } = req.body;

  //find the email that do email verify request and get his verify code
  const emailverifcationCode = await emailVerify
    .findOne({ email: email })
    .then((emailAndVerifyCode) => {
      return emailAndVerifyCode?.verifcationCode;
    });

  //check if the verify code that exist in db is equal to verify code the user is send if not return bad request
  if (emailverifcationCode === verifcationCode) {
    //if verifycode equal delete the verify from verify table
    await emailVerify.findOneAndDelete({ email: email });
    //update the user to be active
    await User.findOneAndUpdate({ email: email }, { isActive: true });
    //send success status
    return res.status(200).json({ msg: "Email verify, User is active!" });
  } else {
    return res.status(400).json({ msg: "Email verify Code is invalid!" });
  }
};
export default { signup, verifyEmail };
