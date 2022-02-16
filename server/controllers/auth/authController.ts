import bcrypt from "bcrypt";
import User from "../../models/User";
import Token from "../../models/resetPasswrodToken";
import express from "express";
import { isErrors } from "../../utils/IsErrorsOnValidation";
import { sendEmail } from "../../utils/email";
import emailVerify from "../../models/emailVerify";
import { IS_PRODUCTION, URLS } from "../../utils/consts";
import { RESPONSE_MSG, MAIL_MESSAGE, TOKEN_IGNORE } from "./consts";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { PASSWORD_RESET_ROUTE } from "../user/consts";

//----------------------------------------------------------------------------------------------------------------------
const signup = async (req: express.Request, res: express.Response) => {
  //check validation errors
  const errors = isErrors(req, true);
  if (errors) return res.status(400).json({ msg: errors });

  const { password, username, email, phoneNumber } = req.body;

  //check if username is already exist
  const userExist = await User.findOne({ username: username });
  if (userExist) {
    return res
      .status(400)
      .json({ message: `${username} ${RESPONSE_MSG.EXIST}` });
  }

  //check if email is already exist
  const emailExist = await User.findOne({ email: email });
  if (emailExist)
    return res.status(400).json({ message: `${email} ${RESPONSE_MSG.EXIST}` });

  //checl if phone is already exist
  const phoneExist = await User.findOne({ phoneNumber: phoneNumber });
  if (phoneExist)
    return res
      .status(400)
      .json({ message: `${phoneNumber} ${RESPONSE_MSG.EXIST}` });

  //password encrypt
  const hashPassword = await bcrypt
    .hash(password, Number(process.env.BCRYPT_SALT!))
    .then((hash) => hash);

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
  const msg = `${MAIL_MESSAGE.VERIFCATION_PRE_URL} ${URL} ${MAIL_MESSAGE.VERIFCATION_POST_URL} ${verifcationCode}`;
  sendEmail(email, "Email verification", msg);

  //return created status
  return res
    .status(201)
    .json({ message: RESPONSE_MSG.USER_CREATED, data: req.body });
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
    return res.status(200).json({ msg: RESPONSE_MSG.VERIFIED_EMAIL });
  } else {
    return res
      .status(400)
      .json({ msg: RESPONSE_MSG.INVALID_VERIFICATION_CODE });
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
          .json({ msg: RESPONSE_MSG.SUCCESSFUL_LOGIN, token, loginUser });
      } else {
        return res.status(400).json({ msg: RESPONSE_MSG.EMAIL_NOT_VERIFIED });
      }
    }
  }
  return res
    .status(400)
    .json({ msg: RESPONSE_MSG.INCORRECT_LOGIN_INFORMATION });
};

//----------------------------------------------------------------------------------------------------------------------
const protect = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  let token, decoded;
  // check if url in ignore list
  if (TOKEN_IGNORE.includes(req.params[0])) return next();
  //check if there is authorization header and the header start with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    //split by space and take the token
    token = req.headers.authorization.split(" ")[1];
  //if the token doest exist return no autorziotion
  if (!token) return res.status(401).json({ msg: RESPONSE_MSG.NOT_AUTHORIZED });
  try {
    //if the token exist verify the token
    decoded = await jwt.verify(token, process.env.JWT_SECRET!);
  } catch (err) {
    //if the verify failed return no autorziotion
    return res.status(401).json({ msg: RESPONSE_MSG.NOT_AUTHORIZED });
  }
  //if the verify success make new param in the body of the user id that the token belong to him
  req.body.user = await User.findOne({ _id: Object.values(decoded)[0] });

  //check if the user is not exist in DB --> jwt belong to user that was deleted
  if (!req.body.user)
    return res.status(401).json({ msg: RESPONSE_MSG.NOT_AUTHORIZED });
  return next();
};

//----------------------------------------------------------------------------------------------------------------------
const restrictTo = (...roles: string[]) => {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    //if the user role that make the request doesnt exist in the restrict roles list return no autorziotion
    if (!roles.includes(req.body.user.role)) {
      return res.status(401).json({ msg: RESPONSE_MSG.NOT_AUTHORIZED });
    }
    return next();
  };
};

//----------------------------------------------------------------------------------------------------------------------
const forgetPassword = async (req: express.Request, res: express.Response) => {
  //check validation errors
  const errors = isErrors(req, true);
  if (errors) return res.status(400).json({ msg: errors });

  //find the user via email if exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ msg: RESPONSE_MSG.USER_NOT_EXIST });

  //check if there is already a Token for him if there is delete it
  const token = await Token.findOne({ _id: user._id });
  if (token) await token.deleteOne();

  //make new random reset token and encrypt him
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt
    .hash(resetToken, Number(process.env.BCRYPT_SALT!))
    .then((hash) => hash);

  //create new pair email and encrypt token with date for expired
  await Token.create({ _id: user._id, token: hash, createdAt: Date.now() });

  //make link with all parms of tkoen and the user id that belong that token
  const link = `${process.env.CLIENT_URL}${PASSWORD_RESET_ROUTE}?token=${resetToken}&id=${user._id}`;

  //send an mail with that reset password link
  sendEmail(
    user.email,
    "Password Reset",
    `${MAIL_MESSAGE.RESET_PASSWORD_PRE} ${link}`
  );

  return res.status(200).json({ msg: RESPONSE_MSG.PASSWORD_RESET_EMAIL });
};

//----------------------------------------------------------------------------------------------------------------------
const resetPassword = async (req: express.Request, res: express.Response) => {
  //check validation errors
  const errors = isErrors(req, true);
  if (errors) return res.status(400).json({ msg: errors });

  //check if the user have a valid request for password reset
  const passwordResetToken = await Token.findOne({ _id: req.body.userId });
  if (!passwordResetToken)
    return res
      .status(400)
      .json({ msg: RESPONSE_MSG.INVALID_PASSWORD_RESET_TOKEN });

  //compare tokens between the request and the token that exist in the DB
  const isValid = await bcrypt.compare(
    req.body.token,
    passwordResetToken.token
  );
  if (!isValid)
    return res
      .status(400)
      .json({ msg: RESPONSE_MSG.INVALID_PASSWORD_RESET_TOKEN });

  //if all is valid hash the new password and update it on the user object in DB
  const hash = await bcrypt.hash(
    req.body.password,
    Number(process.env.BCRYPT_SALT!)
  );
  await User.updateOne(
    { _id: req.body.userId },
    { $set: { password: hash } },
    { new: true }
  );

  //delete the request for password reset in DB and return success
  await passwordResetToken.deleteOne();
  return res.status(200).json({ msg: RESPONSE_MSG.PASSWORD_RESET });
};

export default {
  signup,
  verifyEmail,
  login,
  protect,
  restrictTo,
  forgetPassword,
  resetPassword,
};
