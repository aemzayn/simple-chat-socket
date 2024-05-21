import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { TokenService } from "../services/token-services";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  password: string;
  secret: string;
  createdAt: Date;
  updatedAt: Date;
  genAccessToken: () => string;
  genRefreshToken: () => string;
  comparePassword: (inputPassword: string) => boolean;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
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
  },
  {
    methods: {
      genAccessToken: function () {
        return TokenService.generateAccessToken(this);
      },
      genRefreshToken: function () {
        return TokenService.generateRefreshToken(this);
      },
      comparePassword: function (inputPassword: string) {
        return bcrypt.compareSync(inputPassword, this.password);
      },
    },
  }
);

userSchema.pre("save", function (next) {
  const secret = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(this.password, secret);
  this.password = hashedPassword;
  this.secret = secret;
  this.updatedAt = new Date();
  if (!this.role) {
    this.role = "user";
  }
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
