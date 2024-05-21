import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export interface IUser {
  name: string;
  username: string;
  role: string;
  password: string;
  secret: string;
  createdAt: Date;
  updatedAt: Date;
  genAccessToken: () => string;
  genRefreshToken: () => string;
  comparePassword: (inputPassword: string) => boolean;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  password: {
    type: String,
    required: true,
  },
  secret: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.pre("save", function (next) {
  const secret = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(this.password, secret);
  this.password = hashedPassword;
  this.secret = secret;
  console.log(secret);

  this.updatedAt = new Date();
  if (!this.role) {
    this.role = "user";
  }
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  next();
});

// generate access token
userSchema.methods.genAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      role: this.role,
    },
    this.secret,
    { expiresIn: "1d" }
  );
};

// generate refresh token
userSchema.methods.genRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      role: this.role,
    },
    this.secret,
    { expiresIn: "7d" }
  );
};

userSchema.methods.comparePassword = function (inputPassword: string) {
  return bcrypt.compareSync(inputPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
