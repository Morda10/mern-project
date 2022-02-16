import { Router } from "express";
import authController from "../../controllers/auth/authController";
import { AUTH_ROUTES } from "./consts";
import {
  emailValidation,
  emailVerifyValidation,
  firstNameValidation,
  lastNameValidation,
  passwrodValidation,
  phoneNumberValidation,
  usernameValidation,
} from "./validations";

const router = Router();

router.post(
  AUTH_ROUTES.REGISTER,
  usernameValidation,
  emailValidation,
  passwrodValidation,
  phoneNumberValidation,
  firstNameValidation,
  lastNameValidation,
  authController.signup
);

router.post(AUTH_ROUTES.VERIFY_EMAIL, emailVerifyValidation, authController.verifyEmail);

router.post(
  AUTH_ROUTES.LOGIN,
  emailValidation,
  passwrodValidation,
  authController.login
);

router.post(AUTH_ROUTES.FORGET_PASSWORD, emailValidation, authController.forgetPassword);

router.post(AUTH_ROUTES.RESET_PASSWORD, passwrodValidation, authController.resetPassword);

export default router;
