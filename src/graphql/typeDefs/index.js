import postTypeDef from "./post.js";
import imageTypeDef from "./imageTypeDef.js";
import messageTypeDef from "./message.js";
import roomTypeDef from "./room.js";
import user from "./user.js";
import { gql } from "apollo-server-express";

const linkSchema = gql`
  directive @isAuth on FIELD_DEFINITION
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
`;

export default [
  linkSchema,
  postTypeDef,
  imageTypeDef,
  user,
  messageTypeDef,
  roomTypeDef,
];
