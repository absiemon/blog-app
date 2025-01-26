import { AppError, ValidationError } from '../utills/errorHandlers.js';
import blogService from './service.js';
import { validateCreateBlogBody, validateUpdateBlogBody } from './validator.js';

/**
 * Create a new blog post
 * @type {expressParams}
 */
export const createBlog = async (req, res, next) => {
    try {
        const blogData = req.body;

        const { error } = validateCreateBlogBody(blogData)
        if (error) {
            return next(new ValidationError())
        }

        const authorId = req.user._id; // Get author ID from the authenticated user
        const newBlog = await blogService.createBlog({ ...blogData, author: authorId });

        return res.status(201).json({
            data: newBlog,
            message: "Blog created successfully!"
        });
    }
    catch (error) {
        return next(error);
    }
};

/**
 * Get all blog posts
 * @type {expressParams}
 */
export const getAllBlogs = async (req, res, next) => {
    try {
        const blogs = await blogService.getAllBlogs(req.query);
        return res.status(200).json({ ...blogs });
    }
    catch (error) {
        return next(error);
    }
};

/**
 * Get all blog posts of a user
 * @type {expressParams}
 */
export const getAllBlogsOfUser = async (req, res, next) => {
    try {
        const userId = req?.user?._id;
        const blogs = await blogService.getAllBlogsOfUser(userId, req.query);
        
        return res.status(200).json({ ...blogs });
    }
    catch (error) {
        return next(error);
    }
};

/**
 * Get all blog posts of a user
 * @type {expressParams}
 */
export const getAllBlogCategory = async (req, res, next) => {
    try {
   
        const category = await blogService.getAllBlogCategory();
        
        return res.status(200).json({ data: category });
    }
    catch (error) {
        return next(error);
    }
};

/**
 * Get a single blog post by ID
 * @type {expressParams}
 */
export const getBlogById = async (req, res, next) => {
    try {
        const blogId = req.params.id;
        const blog = await blogService.getBlogById(blogId);

        if (!blog) {
            return next(new AppError(
                "NOT_FOUND",
                404,
                'Blog not found'
            ))
        }

        return res.status(200).json({ data: blog });
    }
    catch (error) {
        return next(error);
    }
};

/**
 * Update a blog post by ID
 * @type {expressParams}
 */
export const updateBlog = async (req, res, next) => {
    try {
        const updateData = req.body;

        const { error } = validateUpdateBlogBody(updateData)
        if (error) {
            return next(new ValidationError())
        }

        const blogId = req.params.id;
        const updatedBlog = await blogService.updateBlog(blogId, updateData);

        if (!updatedBlog) {
            return next(new AppError(
                "NOT_FOUND",
                404,
                'Blog not found'
            ))
        }

        return res.status(200).json({
            data: updatedBlog,
            message: "Blog updated successfully!"
        });
    }
    catch (error) {
        return next(error);
    }
};

/**
 * Delete a blog post by ID
 * @type {expressParams}
 */
export const deleteBlog = async (req, res, next) => {
    try {
        const blogId = req.params.id;
        const deletedBlog = await blogService.deleteBlog(blogId);

        if (!deletedBlog) {
            return next(new AppError(
                "NOT_FOUND",
                404,
                'Blog not found'
            ))
        }

        return res.status(200).json({
            data: deletedBlog,
            message: "Blog deleted successfully!"
        });
    }
    catch (error) {
        return next(error);
    }
};