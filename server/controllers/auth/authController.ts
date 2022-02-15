import bcrypt from "bcrypt";
import User from "../../models/User";
import express from "express";
import { validationResult } from "express-validator";
import { isErrors } from "../../utils/IsErrorsOnValidation";
import { sendEmail } from "../../utils/email";
import emailVerify from "../../models/emailVerify";
import { IS_PRODUCTION, URLS } from "../../utils/consts";
import { VERIFCATION_MAIL_MESSAGE } from "./consts";
import jwt, { JwtPayload } from "jsonwebtoken";
import e from "express";

//----------------------------------------------------------------------------------------------------------------------
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
  const URL = IS_PRODUCTION ? URLS.SERVER_URL : URLS.LOCALHOST_SERVER_URL;
  const msg = `${VERIFCATION_MAIL_MESSAGE.PRE_URL} ${URL} ${VERIFCATION_MAIL_MESSAGE.POST_URL} ${verifcationCode}`;
  sendEmail(email, "Email verification", msg);

  //return created status
  return res.status(201).json({ message: "user created", data: req.body });
};

//----------------------------------------------------------------------------------------------------------------------
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

//----------------------------------------------------------------------------------------------------------------------
const login = async (req: express.Request, res: express.Response) => {
  //check validation errors
  const errors = isErrors(req, true);
  if (errors) return res.status(400).json({ msg: errors });

  const { email, password } = req.body;

  //check if email and password are valid
  const loginUser = await User.findOne({ email: email });
  if (loginUser) {
    //compare the hash password
    const validUser = await bcrypt
      .compare(password, loginUser.password)
      .then((res) => {
        return res;
      });
    //if the hash password compare is success else go to the end return
    if (validUser) {
      //if the email and password are compared and user is active login is success else go to email verify
      if (loginUser.isActive) {
        //create new token to the user
        const token = jwt.sign({ id: loginUser._id }, process.env.JWT_SECRET!, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });
        return res
          .status(200)
          .json({ msg: "Login success!", token, loginUser });
      } else {
        return res.status(400).json({ msg: "Email is not verify!" });
      }
    }
  }
  return res.status(400).json({ msg: "Invalid User Name or Password!" });
};

const protect = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  let token, decoded;
  //check if there is authorization header and the header start with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    //split by space and take the token
    token = req.headers.authorization.split(" ")[1];
  //if the token doest exist return no autorziotion
  if (!token) return res.status(401).json({ msg: "no autorziotion" });
  try {
    //if the token exist verify the token
    decoded = await jwt.verify(token, process.env.JWT_SECRET!);
  } catch (err) {
    //if the verify failed return no autorziotion
    return res.status(401).json({ msg: "no autorziotion" });
  }
  //if the verify success make new param in the body of the user id that the token belong to him
  req.body.userId = Object.values(decoded)[0];
  return next();
};

export default { signup, verifyEmail, login, protect };
