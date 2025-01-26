import Blog from '../schema/blog.js';
import Category from '../schema/category.js';

class BlogService {
    /**
     * Create a new blog post
     * @param {Object} blogData - Blog creation data
     * @returns {Promise<Object>} - Blog post
     */
    async createBlog(blogData) {
        const newBlog = await Blog.create(blogData);
        return newBlog;
    }

    /**
     * Get all blog posts
     * @param {Object} queryParams - Query parameters
     * @returns {Promise<Object[]>} - Array of blog posts
     */
    async getAllBlogs(queryParams) {
        const {
            title,
            sortBy,
        } = queryParams;

        let page = parseInt(queryParams.page) || 1;
        let limit = parseInt(queryParams.limit) || 10;
        const offset = (page - 1) * limit;

        let query = {};

        // Filter by title
        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }

        const sortOrder = sortBy === 'asc' ? 1 : -1;

        // Fetch blogs with filtering, pagination, and sorting
        const blogs = await Blog.find(query)
            .populate('author', 'name email')
            .populate('category', 'name description')
            .skip(offset)
            .limit(limit)
            .sort({ createdAt: sortOrder });

        // Get the total count of blogs matching the query (for pagination metadata)
        const totalCount = await Blog.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limit);

        return {
            data: blogs,
            totalCount,
            totalPages
        };
    }

    /**
    * Get all blog posts of a user
    * @param {string} userId - user 
    * @param {Object} queryParams - Query parameters
    * @returns {Promise<Object[]>} - Array of blog posts
    */
    async getAllBlogsOfUser(userId, queryParams) {
        const {
            title,
            sortBy,
        } = queryParams;

        let page = parseInt(queryParams.page) || 1;
        let limit = parseInt(queryParams.limit) || 10;
        const offset = (page - 1) * limit;

        let query = { author: userId };

        // Filter by title
        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }

        const sortOrder = sortBy === 'asc' ? 1 : -1;

        // Fetch blogs with filtering, pagination, and sorting
        const blogs = await Blog.find(query)
            .populate('author', 'name email')
            .populate('category', 'name description')
            .skip(offset)
            .limit(limit)
            .sort({ createdAt: sortOrder });

        // Get the total count of blogs matching the query (for pagination metadata)
        const totalCount = await Blog.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limit);

        return {
            data: blogs,
            totalCount,
            totalPages
        };
    }

    /**
     * Get a single blog post by ID
     * @param {Object} blogId - Id of the blog
     * @returns {Promise<Object>} - Blog post
     */
    async getBlogById(blogId) {
        const blog = await Blog.findById(blogId).populate('author', 'name email').populate('category', 'name description');
        return blog;
    }

    /**
     * Update a blog post by ID
     * @param {Object} blogId - Id of the blog
     * @param {Object} updateData - Blog data to update
     * @returns {Promise<Object>} - Blog post
     */
    async updateBlog(blogId, updateData) {
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, updateData, { new: true });
        return updatedBlog;
    }

    /**
     * Delete a blog post by ID
     * @param {Object} blogId - Id of the blog
     * @returns {Promise<Object>} - Blog post
     */
    async deleteBlog(blogId) {
        const deletedBlog = await Blog.findByIdAndDelete(blogId);
        return deletedBlog;
    }

    /**
    * Category
    * @returns {Promise<Object>} - Category
    */
    async getAllBlogCategory() {
        const category = await Category.find().select('name description')
        return category;
    }
}

export default new BlogService();