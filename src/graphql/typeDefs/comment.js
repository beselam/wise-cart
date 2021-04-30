import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    comment(postId: ID!): [Comment]!
  }

  extend type Mutation {
    createComment(postId: ID!, text: String!): Comment!
  }
  type Comment {
    id: ID!
    text: String!
    user: User
    createdAt: String!
  }
`;
