import express from "express";
import User from "../../models/User";
import jwt from "jsonwebtoken";
import { CUSTOMER_DATA_FROM_DB, RESPONSE_MSG, USER_ROLES } from "./consts";

const getLoginUserDetails = async (
    req: express.Request,
    res: express.Response
) => {
    //get the user details and restrict user password,ObjectId and role.
    return res.status(200).json(
        (({ username, email, phoneNumber, firstName, lastName }) => ({
            username,
            email,
            phoneNumber,
            firstName,
            lastName,
        }))(req.body.user)
    );
};

const getAllCustomers = async (
    _req: express.Request,
    res: express.Response
) => {
    //get all customers detail restric password,ObjectId and role.
    return res
        .status(200)
        .json(
            await User.find({ role: USER_ROLES.CUSTOMER }).select(CUSTOMER_DATA_FROM_DB).exec()
        );
};

const deleteLoginUser = async (req: express.Request, res: express.Response) => {
    //protect func will insert the user to req object and verify him just pull the user id and delete him
    await User.deleteOne({ _id: req.body.user._id });
    return res.status(200).json({ msg: RESPONSE_MSG.ACCOUNT_DELETED });
};

const deleteCustomer = async (req: express.Request, res: express.Response) => {
    //if get to here the user request come from owner or admin so just delete the customer in the req.body.customerEmail
    await User.deleteOne({ email: req.body.customerEmail });
    return res.status(200).json({ msg: RESPONSE_MSG.CUSTOMER_DELETED });
};

export default {
    getLoginUserDetails,
    getAllCustomers,
    deleteLoginUser,
    deleteCustomer,
};
