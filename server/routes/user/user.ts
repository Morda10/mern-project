import authController from "../../controllers/auth/authController";
import { Router } from "express";
import userController from "../../controllers/user/userController";

const router = Router();

router.get(
  "/getLoginUser",
  authController.protect,
  userController.getLoginUserDetails
);

router.get(
  "/getAllCustomers",
  authController.protect,
  authController.restrictTo("ADMIN", "OWNER"),
  userController.getAllCustomers
);

router.delete(
  "/deleteLoginUser",
  authController.protect,
  userController.deleteLoginUser
);

export default router;
