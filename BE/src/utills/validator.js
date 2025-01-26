import Joi from "joi";
import mongoose from 'mongoose';
export const ObjectId = mongoose.Types.ObjectId;

export const objectIdValidator = Joi.any().custom((value, helpers) => {
    if (!ObjectId.isValid(value)) {
        return helpers.message('Invalid MongoDB ObjectId');
    }
    return value;
});


export const genUniqIdValidator = Joi.object({
    name: Joi.string().required(),
});

export const genVerificationTokenValidator = Joi.object({
    email: Joi.string().required(),
    user_id: objectIdValidator.required()
});

export const genAccessTokenValidator = Joi.object({
    _id: objectIdValidator.required(),
    email: Joi.string().required(),
    name: Joi.string().required(),
    role: Joi.string().required(),
});

export const verifyTokenValidator = Joi.object({
    token: Joi.string().required(),
    session_id: Joi.string().required(),
    device_id:  Joi.string().min(5).invalid('undefined', 'null').required(),
});


export const verifyRefreshTokenValidator = Joi.object({
    refreshToken: Joi.string().required(),
    session_id: Joi.string().required(),
    device_id: Joi.string().required(),
});

