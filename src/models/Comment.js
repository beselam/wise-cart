import mongoose from "mongoose";
const CommentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
    users: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    text: {
      type: String,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

export default mongoose.model("comment", CommentSchema);
