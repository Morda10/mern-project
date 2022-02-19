import express from "express";
import User from "../../models/User";
import { User as user } from "../../models/types/userTypes";
import jwt from "jsonwebtoken";
import {
  RESPONSE_MSG,
  MAIL_MESSAGE,
  TOKEN_IGNORE,
  COOKIE_OPTIONS,
} from "./consts";
import bcrypt from "bcrypt";
import emailVerify from "../../models/emailVerify";
import { IS_PRODUCTION, URLS } from "../../utils/consts";
import { sendEmail } from "../../utils/email";
import Token from "../../models/resetPasswrodToken";
import crypto from "crypto";
import { PASSWORD_RESET_ROUTE } from "../user/consts";
import { AppError } from "../../utils/appError";

export const signTokenAndCookie = async (
  res: express.Response,
  loginUser: user
) => {
  const token = await jwt.sign({ id: loginUser._id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  if (process.env.IS_PRODUCTION === "true") COOKIE_OPTIONS.secure = true;
  res.cookie("jwt", token, COOKIE_OPTIONS);
};

export const hashPasswordAndUpdate = async (req: express.Request) => {
  const hash = await bcrypt.hash(
    req.body.password,
    Number(process.env.BCRYPT_SALT!)
  );
  await User.updateOne(
    { _id: req.body.userId },
    { $set: { password: hash } },
    { new: true }
  );
};

export const isEmailverifcationCodeEqual = async (
  email: string,
  verifcationCode: string
) => {
  const emailverifcationCode = await emailVerify
    .findOne({ email: email })
    .then((emailAndVerifyCode) => {
      return emailAndVerifyCode?.verifcationCode;
    });
  return emailverifcationCode === verifcationCode;
};

export const encryptPasswordAndCreateUser = async (
  req: express.Request,
  password: string
) => {
  const hashPassword = await bcrypt
    .hash(password, Number(process.env.BCRYPT_SALT!))
    .then((hash) => hash);
  await User.create({
    ...req.body,
    password: hashPassword,
  });
};

export const generateVerifcationCodeAndSendMail = async (email: string) => {
  const verifcationCode = Math.random().toString(36).substring(2, 8);
  await emailVerify.create({
    email: email,
    verifcationCode: verifcationCode,
  });
  const URL = IS_PRODUCTION ? URLS.SERVER_URL : URLS.LOCALHOST_SERVER_URL;
  const msg = `${MAIL_MESSAGE.VERIFCATION_PRE_URL} ${URL} ${MAIL_MESSAGE.VERIFCATION_POST_URL} ${verifcationCode}`;
  sendEmail(email, "Email verification", msg);
};

export const generateResetTokenAndSendMail = async (user: user) => {
  await Token.findOne({ _id: user._id }).then((token) => {
    if (token) token.deleteOne();
  });
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt
    .hash(resetToken, Number(process.env.BCRYPT_SALT!))
    .then((hash) => hash);
  await Token.create({ _id: user._id, token: hash, createdAt: Date.now() });
  const link = `${process.env.CLIENT_URL}${PASSWORD_RESET_ROUTE}?token=${resetToken}&id=${user._id}`;
  sendEmail(
    user.email,
    "Password Reset",
    `${MAIL_MESSAGE.RESET_PASSWORD_PRE} ${link}`
  );
};

export const deleteEmailVerifyCodeAndActiveUser = async (email: string) => {
  await emailVerify.findOneAndDelete({ email: email });
  await User.findOneAndUpdate({ email: email }, { isActive: true });
};

export const comparePasswords = async (password: string, loginUser: user) => {
  return await bcrypt.compare(password, loginUser.password).then((res) => {
    return res;
  });
};

export const isActive = async (res: express.Response, loginUser: user) => {
  if (loginUser.isActive) {
    await signTokenAndCookie(res, loginUser);
    return res
      .status(200)
      .json({ msg: RESPONSE_MSG.SUCCESSFUL_LOGIN, loginUser });
  } else {
    return res.status(400).json({ msg: RESPONSE_MSG.EMAIL_NOT_VERIFIED });
  }
};

export const extractToken = async (req: express.Request) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    return req.headers.authorization.split(" ")[1];
  return null;
};

export const pathIgnore = async (req: express.Request) => {
  return await TOKEN_IGNORE.includes(req.originalUrl);
};

export const isUserExistInDB = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
  decoded: string | jwt.JwtPayload
) => {
  return await User.findOne({ _id: Object.values(decoded)[0] }).then((user) => {
    if (!user)
      return res.status(401).json({ msg: RESPONSE_MSG.NOT_AUTHORIZED });
    else {
      req.body.user = user;
      return next();
    }
  });
};

export const checkUniqueFields = async (
  email: string,
  username: string,
  phoneNumber: string,
  next: express.NextFunction
) => {
  const usernameExist = await User.findOne({ username: username });
  const emailExist = await User.findOne({ email: email });
  const phoneNumberExist = await User.findOne({ phoneNumber: phoneNumber });
  const errors: string[] = [];
  if (usernameExist) errors.push(`${username} ${RESPONSE_MSG.EXIST}`);
  if (emailExist) errors.push(`${email} ${RESPONSE_MSG.EXIST}`);
  if (phoneNumberExist) errors.push(`${phoneNumber} ${RESPONSE_MSG.EXIST}`);
  if (errors.length) return next(new AppError(errors, 400));
  return;
};
