import express from 'express';
import { registerUser, loginUser, resetPassword, getAccessToken, logoutUser, logoutUserFromAllSessions, logoutUserFromADevice } from './controller.js';
import { verifyRefreshToken, verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/signup', registerUser);

router.post('/login', loginUser);

router.post('/reset-password', resetPassword);

router.post('/access-token', verifyRefreshToken, getAccessToken);

router.post('/logout', logoutUser)

router.post('/logout/session', verifyToken, logoutUserFromADevice)

router.post('/logout/all-sessions', verifyToken, logoutUserFromAllSessions)

export default router;
