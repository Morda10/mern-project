import { makeUrlPath } from "../../utils/urls";
import { AUTH_ROUTES } from "../../routes/auth/consts";
import { BASE_ROUTES } from "../../utils/consts";
import { APPOINTMENT_ROUTES } from "../../routes/appointment/consts";

export const MAIL_MESSAGE = {
  VERIFCATION_PRE_URL: "For Email verification enter to this link",
  VERIFCATION_POST_URL: "and insert this code",
  RESET_PASSWORD_PRE:
    "To reset the password, please enter the following link and enter the new password. Password reset is valid for one hour.",
};
export const RESPONSE_MSG = {
  NOT_AUTHORIZED: "Not authorized!",
  USER_NOT_EXIST: "User does not exist!",
  EXIST: "Already exists!",
  USER_CREATED: "User created!",
  VERIFIED_EMAIL: "Email verified, user active!",
  INVALID_VERIFICATION_CODE: "Invalid email verification code!",
  SUCCESSFUL_LOGIN: "The connection was successful!",
  EMAIL_NOT_VERIFIED: "User is inactive, please verify email!",
  INCORRECT_LOGIN_INFORMATION: "Invalid User Name or Password!",
  PASSWORD_RESET_EMAIL: "Password reset email sent.",
  INVALID_PASSWORD_RESET_TOKEN: "Invalid or expired password reset token",
  PASSWORD_RESET: "Password reset completed successfully!",
};

export const TOKEN_IGNORE = [
  makeUrlPath(BASE_ROUTES.AUTH, AUTH_ROUTES.LOGIN),
  makeUrlPath(BASE_ROUTES.AUTH, AUTH_ROUTES.REGISTER),
  makeUrlPath(BASE_ROUTES.AUTH, AUTH_ROUTES.RESET_PASSWORD),
  makeUrlPath(BASE_ROUTES.AUTH, AUTH_ROUTES.FORGET_PASSWORD),
  makeUrlPath(BASE_ROUTES.AUTH, AUTH_ROUTES.VERIFY_EMAIL),
];
