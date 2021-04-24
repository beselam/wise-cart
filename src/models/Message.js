import mongoose from "mongoose";
const PostSchema = new mongoose.Schema(
  {
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
    }
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    content: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("message", PostSchema);
