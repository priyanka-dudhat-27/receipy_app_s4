import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true,"name is required"],
      trim: true,
      index: true,
    },
    username: {
      type: String,
      required: [true, "username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    image: {
      type: String,
    },
    followers:[{
        type:mongoose.Types.ObjectId,
        ref:'User'
    }],
    following:[{
        type:mongoose.Types.ObjectId,
        ref:'User'
    }]
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
