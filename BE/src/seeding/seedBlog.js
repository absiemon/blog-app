import Blog from '../schema/blog.js';
import blogs from '../assets/seedData/blogs.json' with { type: 'json' };

/**
 * Seed blogs into the database if the collection is empty.
 */
export const seedBlogs = async () => {
    try {
        const count = await Blog.countDocuments();
        if (count === 0) {
            await Blog.insertMany(blogs);
            console.log('Blogs seeded successfully!');
        } 
        else {
            console.log('Blogs already exist. Skipping seeding.');
        }
    } 
    catch (error) {
        console.error('Error seeding blogs:', error);
    }
};