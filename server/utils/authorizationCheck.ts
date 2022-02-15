import express from "express";
import jwt from "jsonwebtoken";
import { IGNORE_Authorization_PATH } from "./consts";

const checkRequest = async (req: express.Request) => {
  //1)check the path of the request if its on the ignore list return authorization
  if (checkPathList(req)) return true;
  //2)if the path is not on the ignore list check if JWT is exist if not return no authorization
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    token = req.headers.authorization.split(" ")[1];
  if (!token) return false;

  //3)if JWT exist check if is valid if not retrun no authorization
  const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  console.log(decoded);
  return true;
};

const checkPathList = (req: express.Request) => {
  if (
    req.path === IGNORE_Authorization_PATH.LOGIN ||
    req.path === IGNORE_Authorization_PATH.REGISTER ||
    req.path === IGNORE_Authorization_PATH.VERIFY_EMAIL
  ) {
    return true;
  }
  return false;
};
export default { checkRequest };
