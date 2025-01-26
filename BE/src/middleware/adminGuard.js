//middleware for apis.
import { AppError} from "../utills/errorHandlers.js";
import User from "../schema/user.js";
import { roles } from "../config/appConfig.js";
import Blog from "../schema/blog.js";

/**
 * Middleware to check if the authenticated user is the admin or not
 * @type {expressParams}
 */
export const AdminGuard = async (req, res, next) => {

    try {
        const userId = req.user?._id

        //checking whether user is admin or not
        const userData = await User.findById(userId).select('role')

        if (!userData) {
            return next(new AppError(
                "NOT_FOUND",
                400,
                `User not found.`
            ))
        }

        const isAdmin = userData.role === roles.ADMIN
        if (!isAdmin) {
            return next(new AppError(
                "PERMISSION_DENIED",
                400,
                `You don't have permission to perform this action.`
            ))
        }

        next()
    }
    catch (error) {
        return next(error)
    }
}

/**
 * Middleware to check if the authenticated user is the creator of the blog
 * @type {expressParams}
 */
export const BlogCreatorGuard = async (req, res, next) => {
    try {
        const userId = req.user?._id; 
        const blogId = req.params.id; 

        const blog = await Blog.findById(blogId);

        if (!blog) {
            return next(new AppError(
                "NOT_FOUND",
                404,
                "Blog not found."
            ));
        }

        // Checking if the authenticated user is the creator of the blog
        const isCreator = blog.author.toString() === userId.toString();

        if (!isCreator) {
            return next(new AppError(
                "PERMISSION_DENIED",
                403,
                "You don't have permission to perform this action."
            ));
        }

        // If the user is the creator, proceed 
        next();
    } 
    catch (error) {
        return next(error);
    }
};