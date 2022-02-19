import express from "express";
import User from "../../models/User/User";
import jwt from "jsonwebtoken";

const getAllAppointments = async (
  _req: express.Request,
  res: express.Response
) => {
  //get the user details and restrict user password,ObjectId and role.
  return res.status(200).json({ bla: "sdgdsgf" });
};

export default {
  getAllAppointments,
};
