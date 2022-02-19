import rateLimit from "express-rate-limit";

export const IS_PRODUCTION = false;
export const URLS = {
  LOCALHOST_SERVER_URL: "http://localhost:8080/",
  SERVER_URL: "http://walla.co.il",
};

export const BASE_ROUTES = {
  AUTH: "/auth",
  USER: "/user",
  APPOINTMENT: "/appointment",
};

export const USER_ROLE = {
  ADMIN: "ADMIN",
  OWNER: "OWNER",
  CUSTOMER: "CUSTOMER",
};

export const RATE_LIMIT = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, //60 MIN
  message: "Too many requests from this IP, please try again in a hour",
});
