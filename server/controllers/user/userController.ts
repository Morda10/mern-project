import express from "express";
import User from "../../models/User";

const getLoginUserDetails = async (
  req: express.Request,
  res: express.Response
) => {
  const loginUser = await User.findOne({ _id: req.body.userId }).select(
    "-_id username email phoneNumber firstName lastName"
  );
  return res.status(200).json(loginUser);
};

export default { getLoginUserDetails };
