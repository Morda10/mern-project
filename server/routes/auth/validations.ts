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
  .isNumeric()
  .withMessage("Phone number is not valid!")
  .isLength({ min: 10, max: 10 })
  .withMessage("Phone number is not valid!");

export const firstNameValidation = body("firstName")
  .isLength({ min: 2 })
  .withMessage("First Name must be at least 2 chars!")
  .isAlpha()
  .withMessage("First Name must have only letters!");

export const lastNameValidation = body("lastName")
  .isLength({ min: 2 })
  .withMessage("Last Name must be at least 2 chars!")
  .isAlpha()
  .withMessage("Last Name must have only letters!");
