import { gql, GraphQLUpload } from "apollo-server-express";

export default gql`
  extend type Query {
    getAllPosts: [Post]
    getPostByPageAndLimit(page: Int, limit: Int): PostPaginator!
    getAuthenticatedUserPost(page: Int, limit: Int): PostPaginator!
    getUserPosts: [Post] @isAuth
    getPostByCategory(category: String!): [Post]
  }

  extend type Mutation {
    createNewPost(newPost: NewPost!): Boolean!
    updatePost(post: postUpdate): Post! @isAuth
    deletePost(id: ID!): DeleteNotification! @isAuth
  }

  input NewPost {
    title: String!
    description: String!
    price: String!
    category: String!
    featuredImage: [Upload]!
  }

  input postUpdate {
    id: ID!
    title: String
    description: String
    price: String
    category: String
    featuredImage: [String]
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
    description: String!
    category: String!
    price: String!
    featuredImage: [String]
    createdAt: String
    updatedAt: String
    author: User!
  }

  type Subscription {
    newUser: Post!
    newSubscriptionMessage(roomId: ID, postId: ID): Message!
  }
`;
// newSubscriptionMessage(roomId: ID, postId: ID): Message!
