import { Router } from "express";
import { body } from "express-validator";
import authController from "../../controllers/authController";
import {
  emailValidation,
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

router.post("/product", (req, res, _next) => {
  console.log(req.body);
  res.redirect("/");
});

export default router;
