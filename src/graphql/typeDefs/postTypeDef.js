import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getAllPosts: [Post]
    getPostByPageAndLimit(page: Int, limit: Int): PostPaginator!
  }

  extend type Mutation {
    createNewPost(newPost: NewPost!): Post! @isAuth
    updatePost(post: postUpdate): Post! @isAuth
    deletePost(id: ID): DeleteNotification! @isAuth
  }

  input NewPost {
    title: String!
    content: String!
    featuredImage: Upload
  }

  input postUpdate {
    id: ID!
    title: String
    content: String
    featuredImage: String
    createdAt: String
    updatedAt: String
  }

  type DeleteNotification {
    id: ID!
    success: Boolean
  }

  type PostPaginator {
    posts: [Post!]!
    paginator: Paginator!
  }
  type Paginator {
    slNo: Int
    prev: Int
    next: Int
    perPage: Int
    totalPosts: Int
    totalPages: Int
    currentPage: Int
    hasPrevPage: Boolean
    hasNextPage: Boolean
  }
  type Post {
    id: ID
    title: String!
    content: String!
    featuredImage: String
    createdAt: String
    updatedAt: String
    author: User!
  }
`;
