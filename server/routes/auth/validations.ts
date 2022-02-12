import { body } from "express-validator";

export const usernameValidation = body("username")
  .isLength({ min: 6, max: 20 })
  .withMessage("username must have between 6-20 chars!");

export const emailValidation = body("email")
  .isEmail()
  .withMessage("email not valid!");

export const passwrodValidation = body("password")
  .isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minUppercase: 1,
    minSymbols: 0,
  })
  .withMessage(
    "password must be at least 8 chars and conatin one:Lowercase,Uppercase and number!"
  );

export const phoneNumberValidation = body("phoneNumber")
  .isLength({ min: 10, max: 10 })
  .withMessage(
    "password must be at least 8 chars and conatin one:Lowercase,Uppercase and number!"
  );
