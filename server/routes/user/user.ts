import authController from "../../controllers/auth/authController";
import { Router } from "express";
import userController from "../../controllers/user/userController";

const router = Router();

router.get(
  "/getLoginUser",
  authController.protect,
  userController.getLoginUserDetails
);

export default router;
