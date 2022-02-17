import bcrypt from "bcrypt";
import User from "../../models/User";
import { User as user } from "../../models/types/userTypes";
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
  //username && email && phone already exist -> change the input
  const userExist = await User.findOne({ username: username });
  if (userExist)
    return res
      .status(400)
      .json({ message: `${username} ${RESPONSE_MSG.EXIST}` });

  const emailExist = await User.findOne({ email: email });
  if (emailExist)
    return res.status(400).json({ message: `${email} ${RESPONSE_MSG.EXIST}` });

  const phoneExist = await User.findOne({ phoneNumber: phoneNumber });
  if (phoneExist)
    return res
      .status(400)
      .json({ message: `${phoneNumber} ${RESPONSE_MSG.EXIST}` });
  //^ the input check is until here

  await encryptPasswordAndCreateUser(req, password);
  await generateVerifcationCodeAndSendMail(email);
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

  //Email verifcation Code Equal -> delete Email Verify Code And Active User
  //Email verifcation Code Not Equal -> return invalid verification code
  if (await isEmailverifcationCodeEqual(email, verifcationCode)) {
    await deleteEmailVerifyCodeAndActiveUser(email);
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

  //email exist -> verify password
  //email doesnt exist -> return incorrect login information
  const emailExist = await User.findOne({ email: email });
  if (emailExist) {
    if (await comparePasswords(password, emailExist)) {
      //user active -> sign jwt on cookies
      //user not active -> need verify the email
      return await isActive(res, emailExist);
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
  let decoded;
  if (await pathIgnore(req)) return next();
  const token = await extractToken(req);
  //token exist -> verify him
  //token doesnt exist -> return not authorized
  if (!token) return res.status(401).json({ msg: RESPONSE_MSG.NOT_AUTHORIZED });
  try {
    decoded = await jwt.verify(token, process.env.JWT_SECRET!);
  } catch (err) {
    return res.status(401).json({ msg: RESPONSE_MSG.NOT_AUTHORIZED });
  }
  //token verify success -> check if user exist in DB
  //user exist in DB -> put the user in req.body.user and run next()
  //user doesnt exist in DB -> return not authorized
  return await isUserExistInDB(req, res, next, decoded);
};

//----------------------------------------------------------------------------------------------------------------------
const restrictTo = (...roles: string[]) => {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    //request user role on list -> return next()
    //request user role not on list -> return NOT_AUTHORIZED
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

  //user exist -> generate reset token and send a verify mail
  //user not exist -> return USER_NOT_EXIST
  const userExist = await User.findOne({ email: req.body.email });
  if (!userExist)
    return res.status(400).json({ msg: RESPONSE_MSG.USER_NOT_EXIST });

  await generateResetTokenAndSendMail(userExist);
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

  await hashPasswordAndUpdate(req);

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

//------------------------------------help function ------------------------------------------

const signTokenAndCookie = async (res: express.Response, loginUser: user) => {
  const token = await jwt.sign({ id: loginUser._id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    secure: false,
    httpOnly: true,
  };
  if (process.env.IS_PRODUCTION) cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);
};

const hashPasswordAndUpdate = async (req: express.Request) => {
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

const isEmailverifcationCodeEqual = async (
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

const encryptPasswordAndCreateUser = async (
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

const generateVerifcationCodeAndSendMail = async (email: string) => {
  const verifcationCode = Math.random().toString(36).substring(2, 8);
  await emailVerify.create({
    email: email,
    verifcationCode: verifcationCode,
  });
  const URL = IS_PRODUCTION ? URLS.SERVER_URL : URLS.LOCALHOST_SERVER_URL;
  const msg = `${MAIL_MESSAGE.VERIFCATION_PRE_URL} ${URL} ${MAIL_MESSAGE.VERIFCATION_POST_URL} ${verifcationCode}`;
  sendEmail(email, "Email verification", msg);
};

const generateResetTokenAndSendMail = async (user: user) => {
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

const deleteEmailVerifyCodeAndActiveUser = async (email: string) => {
  await emailVerify.findOneAndDelete({ email: email });
  await User.findOneAndUpdate({ email: email }, { isActive: true });
};

const comparePasswords = async (password: string, loginUser: user) => {
  return await bcrypt.compare(password, loginUser.password).then((res) => {
    return res;
  });
};

const isActive = async (res: express.Response, loginUser: user) => {
  if (loginUser.isActive) {
    await signTokenAndCookie(res, loginUser);
    return res
      .status(200)
      .json({ msg: RESPONSE_MSG.SUCCESSFUL_LOGIN, loginUser });
  } else {
    return res.status(400).json({ msg: RESPONSE_MSG.EMAIL_NOT_VERIFIED });
  }
};

const extractToken = async (req: express.Request) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    return req.headers.authorization.split(" ")[1];
  return null;
};

const pathIgnore = async (req: express.Request) => {
  return await TOKEN_IGNORE.includes(req.originalUrl);
};

const isUserExistInDB = async (
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
