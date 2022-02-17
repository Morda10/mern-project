import authController from "../../controllers/auth/authController";
import { Router } from "express";
import userController from "../../controllers/user/userController";
import { USER_ROLE } from "../../utils/consts";
import { USER_ROUTES } from "./const";
const router = Router();

router.get(USER_ROUTES.GET_LOGIN_USER, userController.getLoginUserDetails);

router.get(
  USER_ROUTES.GET_ALL_CUSTOMERS,
  authController.restrictTo(USER_ROLE.ADMIN, USER_ROLE.OWNER),
  userController.getAllCustomers
);

router.delete(USER_ROUTES.DELETE_LOGIN_USER, userController.deleteLoginUser);

router.delete(
  USER_ROUTES.DELETE_CUSTOMER,
  authController.restrictTo(USER_ROLE.ADMIN, USER_ROLE.OWNER),
  userController.deleteCustomer
);

export default router;
