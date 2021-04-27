import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    message(id: ID!): [Message]
  }

  extend type Mutation {
    createMessage(newMessage: NewMessage!): Message
  }
  input NewMessage {
    postId: ID!
    roomId: ID
    user: ID!
    receiver: ID!
    text: String!
  }
  type Message {
    roomId: ID
    postId: ID
    _id: ID!
    user: User!
    receiver: User!
    text: String!
    createdAt: String!
  }
`;
