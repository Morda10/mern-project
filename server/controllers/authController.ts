import bcrypt from "bcrypt";
import User from "../models/User";
import express from "express";
import { validationResult } from "express-validator";
import { isErrors } from "../utils/utils";

const signup = async (req: express.Request, res: express.Response) => {
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

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
  });
  return res.status(201).json({ message: "user created", data: req.body });
};

export default { signup };
