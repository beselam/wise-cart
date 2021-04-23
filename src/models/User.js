import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    avatarImage: {
      type: String,
      default:
        "https://www.foodwest.fi/wp-content/uploads/2016/11/blank-profile-picture-973460_1280.png",
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("user", UserSchema);
