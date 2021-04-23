import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    authUserProfile: User! @isAuth
    getUsers: [User] @isAuth
    loginUser(email: String!, password: String!): AuthResponse!
  }

  extend type Mutation {
    registerUser(newUser: UserInput!): AuthResponse!
  }
  input UserInput {
    username: String!
    email: String!
    password: String!
    avatarImage: Upload
  }
  type User {
    id: ID!
    username: String!
    email: String!
    avatarImage: String!
  }

  type AuthResponse {
    token: String
    user: User!
  }
`;
