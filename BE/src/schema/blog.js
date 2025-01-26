import mongoose from "mongoose";
import { allowedBlogStatuses } from '../blog/validator.js'

const blogSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        status: { type: String, default: 'ACTIVE', enum: allowedBlogStatuses },
    },
    {
        timestamps: true,
        collection: 'blog'
    }
);

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
