import lodash from "lodash";

import jwt from "jsonwebtoken";

import { SECRET } from "../config/index.js";

export const issueAuthToken = async (jwtPayload) => {
  console.log("token request");
  let token = await jwt.sign(jwtPayload, SECRET, {
    expiresIn: 3600 * 24,
  });
  return `Bearer ${token}`;
};

export const serializeUser = (user) =>
  lodash.pick(user, ["_id", "email", "name", "avatar"]);
