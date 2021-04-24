import PostModel from "../../models/Post.js";
import { createWriteStream, mkdir } from "fs";
import shortid from "shortid";
import { ApolloError } from "apollo-server-errors";
import { NewPostRules } from "../../validators/postValidator.js";
import { PubSub } from "graphql-subscriptions";
import mongoose from "mongoose";
const PostLabels = {
  docs: "posts",
  limit: "perPage",
  nextPage: "next",
  prevPage: "prev",
  meta: "paginator",
  page: "currentPage",
  pagingCounter: "slNo",
  totalDocs: "totalPosts",
  totalPages: "totalPages",
};

const storeUpload = async (file) => {
  const { createReadStream, filename, mimetype } = await file;
  const stream = await createReadStream();
  const id = shortid.generate();
  let path = `src/uploads/${id}-${filename}`;
  await stream.pipe(createWriteStream(path));
  path = `http://10.69.1.56:7000/${path}`;
  return path;
};

const NEW_USER = "NEW_USER";
const pubsub = new PubSub();
export default {
  Query: {
    getAllPosts: async (_, args) => {
      let posts = await PostModel.find().populate("author", { password: 0 });

      pubsub.publish(NEW_USER, { newUser: posts[0] });

      return posts;
    },
    getUserPosts: async (_, args, { user }) => {
      try {
        let posts = await PostModel.find({ author: user.id });
        console.log(posts);
        return posts;
      } catch (e) {
        throw new ApolloError(e.message);
      }
    },
    getPostByCategory: async (_, { category }) => {
      try {
        console.log("ww", category);
        let posts = await PostModel.find({ category: category }).populate(
          "author"
        );
        console.log(posts);
        return posts;
      } catch (e) {
        throw new ApolloError(e.message);
      }
    },
    getPostByPageAndLimit: async (_, { page, limit }) => {
      try {
        const options = {
          page: page || 1,
          limit: limit || 10,
          sort: {
            createdAt: -1,
          },
          populate: "author",
          customLabels: PostLabels,
        };

        let post = await PostModel.paginate({}, options);
        console.log(post);
        return post;
      } catch (e) {
        throw new ApolloError(e.message);
      }
    },
  },

  Mutation: {
    createNewPost: async (_, { newPost }, { user }) => {
      try {
        const { title, description, price, featuredImage } = await newPost;
        await NewPostRules.validate(
          { title, description, price },
          { abortEarly: false }
        );
        const files = await Promise.all(featuredImage.map(await storeUpload));
        console.log("ss", files);
        newPost.featuredImage = files;
        const post = new PostModel({ ...newPost, author: user.id });
        const result = await post.save();
        //await result.populate("author").execPopulate();
        return true;
      } catch (e) {
        throw new ApolloError(e.message);
      }
    },

    updatePost: async (_, args, { user }) => {
      try {
        const { post } = args;
        console.log(post);
        console.log("uu", user.id.toString());
        const postO = await PostModel.findOneAndUpdate(
          { _id: post.id, author: user.id.toString() },
          { ...post },
          {
            new: true,
          }
        );
        if (!postO) {
          throw new Error("unable to edit post");
        }
        return postO;
      } catch (e) {
        throw new ApolloError(e.message);
      }
    },

    deletePost: async (_, { id }, { user }) => {
      try {
        const deletedPost = await PostModel.findOneAndDelete({
          _id: id,
          author: user.id.toString(),
        });
        if (!deletedPost) {
          throw new Error("unable delete post");
        }
        return {
          id: mm._id,
          success: true,
        };
      } catch (e) {
        throw new ApolloError(e.message);
      }
    },
  },

  Subscription: {
    newUser: {
      subscribe: () => {
        return pubsub.asyncIterator(NEW_USER);
      },
    },
  },
};
