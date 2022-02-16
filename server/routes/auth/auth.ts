import { Router } from "express";
import authController from "../../controllers/auth/authController";
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
  "/register",
  usernameValidation,
  emailValidation,
  passwrodValidation,
  phoneNumberValidation,
  firstNameValidation,
  lastNameValidation,
  authController.signup
);

router.post("/verifyEmail", emailVerifyValidation, authController.verifyEmail);

router.post(
  "/login",
  emailValidation,
  passwrodValidation,
  authController.login
);

router.post("/forgetPassword", emailValidation, authController.forgetPassword);

router.post("/resetPassword", passwrodValidation, authController.resetPassword);

export default router;
