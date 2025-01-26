//Post request validation using joi.
import Joi from 'joi';

export function validateUpdateUserBody(body) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(24).allow('', null),
        profile_image: Joi.binary().allow({}, '', null).optional(),
    });
    return schema.validate(body);
}


export function validateCreateUserSessionParameters(body) {
    const schema = Joi.object({
        device_info: Joi.object({
            device_name: Joi.string().optional(),
            ip_address: Joi.string().optional(),
            platform: Joi.string().optional(),
        }).required(),
        device_id: Joi.string().required(),
        user: Joi.string().required(),
        refresh_token: Joi.string().required()
    });
    return schema.validate(body);
}

