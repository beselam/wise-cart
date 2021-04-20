import mongoose from "mongoose";
import paginator from "mongoose-paginate-v2";
const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    featuredImage: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);
PostSchema.plugin(paginator);
export default mongoose.model("post", PostSchema);
