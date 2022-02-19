import bcrypt from "bcrypt";
import User from "../../models/User";
import { User as user } from "../../models/types/userTypes";
import Token from "../../models/resetPasswrodToken";
import express from "express";
import { isErrors } from "../../utils/IsErrorsOnValidation";
import { sendEmail } from "../../utils/email";
import emailVerify from "../../models/emailVerify";
import { IS_PRODUCTION, URLS } from "../../utils/consts";
import {
  RESPONSE_MSG,
  MAIL_MESSAGE,
  TOKEN_IGNORE,
  COOKIE_OPTIONS,
} from "./consts";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { PASSWORD_RESET_ROUTE } from "../user/consts";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../utils/appError";
import {
  checkUniqueFields,
  comparePasswords,
  deleteEmailVerifyCodeAndActiveUser,
  encryptPasswordAndCreateUser,
  extractToken,
  generateResetTokenAndSendMail,
  generateVerifcationCodeAndSendMail,
  hashPasswordAndUpdate,
  isActive,
  isEmailverifcationCodeEqual,
  isUserExistInDB,
  pathIgnore,
} from "./authUtils";

const signup = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    //check validation errors
    const errors = isErrors(req, true);
    if (errors) return next(new AppError(errors as string[], 400));

    const { password, username, email, phoneNumber } = req.body;
    //username && email && phone already exist -> return 400 bad request
    checkUniqueFields(email, username, phoneNumber, next);
    //^ the input check is until here

    await encryptPasswordAndCreateUser(req, password);
    await generateVerifcationCodeAndSendMail(email);
    const responseObject: any = {
      message: RESPONSE_MSG.USER_CREATED,
      data: req.body,
    };
    return res.status(201).json(responseObject);
  }
);

const verifyEmail = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    //check validation errors
    const errors = isErrors(req, true);
    if (errors) return next(new AppError(errors as string[], 400));

    const { email, verifcationCode } = req.body;

    //Email verifcation Code Equal -> delete Email Verify Code And Active User
    //Email verifcation Code Not Equal -> return invalid verification code
    if (await isEmailverifcationCodeEqual(email, verifcationCode)) {
      await deleteEmailVerifyCodeAndActiveUser(email);
      return res.status(200).json({ msg: RESPONSE_MSG.VERIFIED_EMAIL });
    } else
      return next(new AppError(RESPONSE_MSG.INVALID_VERIFICATION_CODE, 400));
  }
);

const login = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    //check validation errors
    const errors = isErrors(req, true);
    if (errors) return next(new AppError(errors, 400));

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
    return next(new AppError(RESPONSE_MSG.INCORRECT_LOGIN_INFORMATION, 400));
  }
);

const protect = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    let decoded;
    if (await pathIgnore(req)) return next();
    const token = await extractToken(req);
    //token exist -> verify him
    //token doesnt exist -> return not authorized
    if (!token) return next(new AppError(RESPONSE_MSG.NOT_AUTHORIZED, 401));
    decoded = await jwt.verify(token, process.env.JWT_SECRET!);
    //token verify success -> check if user exist in DB
    //user exist in DB -> put the user in req.body.user and run next()
    //user doesnt exist in DB -> return not authorized
    return await isUserExistInDB(req, res, next, decoded);
  }
);

const restrictTo = (...roles: string[]) => {
  return (
    req: express.Request,
    _res: express.Response,
    next: express.NextFunction
  ) => {
    //request user role on list -> return next()
    //request user role not on list -> return NOT_AUTHORIZED
    if (!roles.includes(req.body.user.role))
      return next(new AppError(RESPONSE_MSG.NOT_AUTHORIZED, 401));
    return next();
  };
};

const forgetPassword = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    //check validation errors
    const errors = isErrors(req, true);
    if (errors) return next(new AppError(errors, 400));

    //user exist -> generate reset token and send a verify mail
    //user not exist -> return USER_NOT_EXIST
    const userExist = await User.findOne({ email: req.body.email });
    if (!userExist) return next(new AppError(RESPONSE_MSG.USER_NOT_FOUND, 404));

    await generateResetTokenAndSendMail(userExist);
    return res.status(200).json({ msg: RESPONSE_MSG.PASSWORD_RESET_EMAIL });
  }
);

const resetPassword = catchAsync(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    //check validation errors
    const errors = isErrors(req, true);
    if (errors) return next(new AppError(errors, 400));

    //check if the user have a valid request for password reset
    const passwordResetToken = await Token.findOne({ _id: req.body.userId });
    if (!passwordResetToken)
      return next(new AppError(RESPONSE_MSG.INVALID_PASSWORD_RESET_TOKEN, 400));

    //compare tokens between the request and the token that exist in the DB
    if (!(await bcrypt.compare(req.body.token, passwordResetToken.token)))
      return next(new AppError(RESPONSE_MSG.INVALID_PASSWORD_RESET_TOKEN, 400));

    await hashPasswordAndUpdate(req);

    //delete the request for password reset in DB and return success
    await passwordResetToken.deleteOne();
    return res.status(200).json({ msg: RESPONSE_MSG.PASSWORD_RESET });
  }
);

export default {
  signup,
  verifyEmail,
  login,
  protect,
  restrictTo,
  forgetPassword,
  resetPassword,
};
