import express from 'express';

import authRouter from './auth/router.js'
import userRouter from './user/router.js'
import blogRouter from './blog/router.js'
import dashboardRouter from './dashboard/router.js'

import { verifyToken } from './middleware/verifyToken.js';

const router = express.Router();

router.use('/auth', authRouter);

router.use('/user', verifyToken, userRouter);

router.use('/blog', verifyToken, blogRouter);

router.use('/dashboard', dashboardRouter);

export default router;
