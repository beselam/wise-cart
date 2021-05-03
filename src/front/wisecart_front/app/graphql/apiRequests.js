import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
  mutation registerUser($email: String!, $name: String!, $password: String!) {
    registerUser(newUser: { email: $email, name: $name, password: $password }) {
      token
      user {
        _id
        email
        name
        avatar
      }
    }
  }
`;

export const GET_ALL_POST = gql`
  query getAllPosts {
    getAllPosts {
      id
      title
      description
      price
      featuredImage
      category
      author {
        _id
        name
        avatar
      }
      location {
        type
        coordinates
      }
    }
  }
`;
export const GET_ROOM = gql`
  query singleRoom($postId: ID!, $usersId: [ID]!) {
    singleRoom(postId: $postId, usersId: $usersId) {
      id
    }
  }
`;
export const GET_MESSAGES = gql`
  query message($id: ID!) {
    message(id: $id) {
      _id
      text
      user {
        _id
        avatar
        name
      }
    }
  }
`;
export const GET_POST_BY_CATEGORY = gql`
  query getPostByCategory($category: String!) {
    getPostByCategory(category: $category) {
      id
      title
      description
      price
      featuredImage
      category
      author {
        _id
        name
        avatar
      }
      location {
        type
        coordinates
      }
    }
  }
`;

export const UPDATE_POST = gql`
  mutation updatePost(
    $id: ID!
    $title: String
    $description: String
    $category: String
    $price: String
  ) {
    updatePost(
      post: {
        id: $id
        title: $title
        description: $description
        category: $category
        price: $price
      }
    ) {
      id
    }
  }
`;

export const LOGIN_USER = gql`
  query loginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      token
      user {
        _id
        email
        name
        avatar
      }
    }
  }
`;
export const USER_PROFILE = gql`
  query authUserProfile {
    authUserProfile {
      _id
      email
      name
      avatar
    }
  }
`;
export const DELETE_POST = gql`
  mutation deletePost($id: ID!) {
    deletePost(id: $id)
  }
`;

export const USER_POSTS = gql`
  query getUserPosts {
    getUserPosts {
      id
      title
      description
      category
      price
      featuredImage
      createdAt
      updatedAt
      location {
        type
        coordinates
      }
    }
  }
`;

export const CREATE_POST = gql`
  mutation createNewPost(
    $title: String!
    $description: String!
    $category: String!
    $price: String!
    $featuredImage: [Upload!]!
    $location: LocData
  ) {
    createNewPost(
      newPost: {
        title: $title
        description: $description
        category: $category
        price: $price
        featuredImage: $featuredImage
        location: $location
      }
    )
  }
`;
export const CREATE_MESSAGE = gql`
  mutation createMessage(
    $postId: ID!
    $roomId: ID
    $user: ID!
    $receiver: ID!
    $text: String!
  ) {
    createMessage(
      newMessage: {
        postId: $postId
        roomId: $roomId
        user: $user
        receiver: $receiver
        text: $text
      }
    ) {
      roomId
      _id
      user {
        _id
        name
        avatar
      }
      text
    }
  }
`;

export const SUBSCRIBE_FOR_NEW_MESSAGE = gql`
  subscription newSubscriptionMessage($roomId: ID, $postId: ID) {
    newSubscriptionMessage(roomId: $roomId, postId: $postId) {
      roomId
      _id
      user {
        _id
        name
        avatar
      }
      text
    }
  }
`;

export const CREATE_ROOM = gql`
  mutation createRoom($postId: ID, $users: [ID]) {
    createRoom(newRoom: { postId: $postId, users: $users }) {
      id
    }
  }
`;

export const GET_POST_BY_LOCATION = gql`
  query getPostByLocation($long: Float!, $lat: Float!, $maxDistance: Int!) {
    getPostByLocation(long: $long, lat: $lat, maxDistance: $maxDistance) {
      id
      title
      description
      price
      featuredImage
      category
      author {
        _id
        name
        avatar
      }
      location {
        type
        coordinates
      }
    }
  }
`;

export const UPDATE_PICTURE = gql`
  mutation updateProfilePic($picture: Upload!) {
    updateProfilePic(picture: $picture) {
      _id
      email
      name
      avatar
    }
  }
`;
export const USER_CHAT_ROOMS = gql`
  query userRoomList {
    userRoomList {
      id
      postId {
        id
        title
        price
        featuredImage
      }
      users {
        _id
        name
        email
        avatar
        __typename
      }
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation createComment($postId: ID!, $text: String!) {
    createComment(postId: $postId, text: $text) {
      id
      text
      user {
        _id
        name
        email
        avatar
      }
      createdAt
    }
  }
`;

export const GET_COMMENT = gql`
  query comment($postId: ID!) {
    comment(postId: $postId) {
      id
      text
      user {
        _id
        name
        email
        avatar
      }
      createdAt
    }
  }
`;
export const DELETE_ROOM = gql`
  mutation deleteRoom($roomId: ID!) {
    deleteRoom(roomId: $roomId)
  }
`;
