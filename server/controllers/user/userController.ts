import express from "express";
import User from "../../models/User";

const getLoginUserDetails = async (
  req: express.Request,
  res: express.Response
) => {
  const loginUser = (({
    username,
    email,
    phoneNumber,
    firstName,
    lastName,
  }) => ({ username, email, phoneNumber, firstName, lastName }))(req.body.user);
  console.log(loginUser);
  return res.status(200).json(loginUser);
};

const getAllCustomers = async (
  _req: express.Request,
  res: express.Response
) => {
  const allCustomers = await User.find({ role: "CUSTOMER" })
    .select("-_id username email phoneNumber firstName lastName")
    .exec();
  return res.status(200).json(allCustomers);
};

export default { getLoginUserDetails, getAllCustomers };
