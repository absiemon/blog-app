//Post request validation using joi.
import Joi from 'joi';
import { roles } from '../config/appConfig.js';

const allowedRoles = Object.values(roles)

export function validateRegister(body) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string()
            .min(6) // Minimum 6 characters
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])')) // At least one lowercase, one uppercase, one number, and one special character
            .message('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)')
            .required(),

        role: Joi.string().valid(...allowedRoles).required(),
        device_info: Joi.object({
            device_name: Joi.string().allow('', null).optional(),
            ip_address: Joi.string().allow('', null).optional(),
            platform: Joi.string().optional()
        }).required(),

    })

    return schema.validate(body);
}

export function validateLogin(body) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        device_info: Joi.object({
            device_name: Joi.string().optional(),
            ip_address: Joi.string().optional(),
            platform: Joi.string().optional()
        }).required()
    });
    return schema.validate(body);
}
