import postResolver from "./post.js";
import imageResolver from "./imageResolver.js";
import roomResolver from "./room.js";
import messageResolver from "./message.js";
import userResolver from "./user.js";
import commentResolver from "./comment.js";

export default [
  postResolver,
  imageResolver,
  userResolver,
  roomResolver,
  messageResolver,
  commentResolver,
];
