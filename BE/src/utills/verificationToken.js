import jwt from 'jsonwebtoken';
import mongoose from 'mongoose'
import { AppError, validateParams } from './errorHandlers.js';
import { genVerificationTokenValidator } from './validator.js';
import { verificationTokenSecKey } from '../config/appConfig.js';
const ObjectId = mongoose.Types.ObjectId;

/**
 * @param {string} email - string email 
 * @param {ObjectId} user_id - mongo db user _id
 */
export function generateVerificationToken(user_id, email) {

    validateParams(genVerificationTokenValidator, { email, user_id });

    try {
        const payload = {
            email,
            user_id,
        };
        const verificationToken = jwt.sign(payload, verificationTokenSecKey, { expiresIn: '7d' });
        return verificationToken;
    }
    catch (error) {
        throw new AppError(
            "SERVER_ERROR",
            500,
            "Error occurred while generating verification token"
        )
    }
}

/**
 * @param {string} token 
 */
export function verifyVerificationToken(token) {
    try {
        const decoded = jwt.verify(token, verificationTokenSecKey);
        return { valid: true, decoded };
    }
    catch (error) {
        throw new AppError(
            "BAD_REQUEST",
            400,
            "Invalid verification link or expired"
        )
    }
}
