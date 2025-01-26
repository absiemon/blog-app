import express from 'express';
import {
    createBlog,
    getBlogById,
    updateBlog,
    deleteBlog,
    getAllBlogs,
    getAllBlogsOfUser,
    getAllBlogCategory
} from './controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { AdminGuard, BlogCreatorGuard } from '../middleware/adminGuard.js';

const router = express.Router();

router.post('/', verifyToken, AdminGuard, createBlog);

router.get('/', verifyToken, getAllBlogs);
router.get('/user', verifyToken, AdminGuard, getAllBlogsOfUser);

router.get('/category', verifyToken, AdminGuard, getAllBlogCategory);

router.get('/:id', verifyToken, getBlogById);


router.put('/:id', verifyToken, AdminGuard, BlogCreatorGuard, updateBlog);

router.delete('/:id', verifyToken, AdminGuard, BlogCreatorGuard, deleteBlog);

export default router;