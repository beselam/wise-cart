import PostModel from "../../models/Post.js";
import { createWriteStream, mkdir } from "fs";
import shortid from "shortid";
import { ApolloError } from "apollo-server-errors";
import { NewPostRules } from "../../validators/postValidator.js";

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

const storeUpload = async ({ stream, filename, mimetype }) => {
  const id = shortid.generate();
  let path = `src/uploads/${id}-${filename}`;
  await stream.pipe(createWriteStream(path));
  path = `http://localhost:7000/${path}`;
  return { filename, id, mimetype, path };
};

const processUpload = async (upload) => {
  const { createReadStream, filename, mimetype } = await upload;
  const stream = createReadStream();
  const file = await storeUpload({ stream, filename, mimetype });
  return file;
};

export default {
  Query: {
    getAllPosts: async (_, args, { isAuth }) => {
      console.log("dd", isAuth);
      const posts = await PostModel.find();
      return posts;
    },
    getPostByPageAndLimit: async (_, { page, limit }) => {
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
    },
  },

  Mutation: {
    createNewPost: async (_, { newPost }, { user }) => {
      try {
        const { title, content, featuredImage } = newPost;
        await NewPostRules.validate({ title, content }, { abortEarly: false });
        const upload = await processUpload(featuredImage);
        newPost.featuredImage = await upload.path;
        const post = new PostModel({ ...newPost, author: user.id });
        const result = await post.save();
        await result.populate("author").execPopulate();
        return result;
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
        console.log("poat", postO);
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
};
