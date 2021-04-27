import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    room(id: ID!): [Room]
    singleRoom(postId: ID!, usersId: [ID]!): Room
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
`;
