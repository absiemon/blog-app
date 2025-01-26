import Joi from 'joi';

import { blogStatuses } from '../config/appConfig.js';

export const allowedBlogStatuses = Object.values(blogStatuses)

/**
 * Validate the request body for creating a blog post
 */
export function validateCreateBlogBody(body) {
    const schema = Joi.object({
        title: Joi.string().min(3).max(100).required(),
        content: Joi.string().min(10).required(),
        category: Joi.string().required(),
        status: Joi.string().valid(...allowedBlogStatuses).default('ACTIVE')
    });
    return schema.validate(body);
}

/**
 * Validate the request body for updating a blog post
 */
export function validateUpdateBlogBody(body) {
    const schema = Joi.object({
        title: Joi.string().min(3).max(100).optional(),
        content: Joi.string().min(10).optional(),
        category: Joi.string().optional(),
        status: Joi.string().valid(...allowedBlogStatuses).optional()
    });
    return schema.validate(body);
}