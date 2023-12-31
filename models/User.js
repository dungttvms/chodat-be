const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const userSchema = Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    emailVerified: { type: String, default: "" },
    password: { type: String, required: false, select: false },
    oldPassword: { type: String },
    newPassword: { type: String },
    role: { type: String, enum: ["admin", "client"], default: "client" },
    avatar: { type: String, required: false, default: "" },
    isDeleted: { type: Boolean, default: false, select: false },
    postCount: { type: Number, default: 0 },
    isGoogleAuth: { type: Boolean, default: false, select: true },
    favoritePostList: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

//Khong tra password ve
userSchema.methods.toJSON = function () {
  const user = this._doc;
  delete user.password;
  delete user.isDeleted;
  return user;
};
//Tao accessToken co hieu luc 1ngay
userSchema.methods.generateToken = async function () {
  const accessToken = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return accessToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
