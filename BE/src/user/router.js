import express from 'express';
import {
    getSingleUser,
    getUserSession,
    sendEmailVerificationLink,
    verifyEmail
} from './controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
import multer from 'multer';

const router = express.Router();

router.get('/', verifyToken,  getSingleUser);


router.get('/sessions', verifyToken, getUserSession);

router.post('/email-verification-link', verifyToken, sendEmailVerificationLink);

router.post('/verify-email', verifyToken, verifyEmail);


export default router;
