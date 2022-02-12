import { body } from "express-validator";

export const registerValidation = ()=>body('username').isLength({min:6,max:20}).withMessage("zibi zibi")