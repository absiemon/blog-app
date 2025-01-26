import express from 'express';
import { getSidebarMenuItems } from './controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/menu', verifyToken, getSidebarMenuItems);


export default router;
