import mongoose from "mongoose";
import slugify from "slugify";
const { Schema } = mongoose;

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  slug: String,
  author: {
    type: String,
    required: true,
  },
  body: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isPublished: { type: Boolean, default: false },
});

blogSchema.pre("save", function (next) {
  const date = new Date();
  this.slug = slugify(date.getTime() + "_" + this.title);
  next();
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
