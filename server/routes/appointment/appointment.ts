import authController from "../../controllers/auth/authController";
import { Router } from "express";
import userController from "../../controllers/user/userController";
import { APPOINTMENT_ROUTES } from "./consts";
// import { protectedRoute } from "./../../utils/protectedRoutes";
import appointmentController from "../../controllers/appointment/appointmentController";

const router = Router();

router.get(
    APPOINTMENT_ROUTES.GET_ALL_APPOIMTMENTS,
    appointmentController.getAllAppointments
);

// router.get(
//     APPOINTMENT_ROUTES.GET_ALL_APPOIMTMENTS,
//     authController.protect,
//     userController.getLoginUserDetails
// );

export default router;