import { Schema, model } from "mongoose";

const refreshTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  deviceInfo: String,
});

const RefreshToken = model("RefreshToken", refreshTokenSchema);

export default RefreshToken;
