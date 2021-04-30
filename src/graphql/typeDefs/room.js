import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    singleRoom(postId: ID!, usersId: [ID]!): Room
    userRoomList: [UserRoom]! @isAuth
  }

  extend type Mutation {
    createRoom(newRoom: NewRoom!): Room
  }

  input NewRoom {
    postId: ID
    users: [ID]
  }

  type Room {
    id: ID!
    postId: ID!
    users: [User]
  }
  type UserRoom {
    id: ID!
    postId: Post
    users: [User]
  }
`;
