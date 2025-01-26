import crypto from 'crypto';
import { v4 as UUIDv4 } from 'uuid';
import { AppError, validateParams } from './errorHandlers.js';
import { genUniqIdValidator } from './validator.js';

/**
 * @param {string} name 
 */
export async function generateUniqueId(name) {
    //prams validation
    validateParams(genUniqIdValidator, { name });

    try {
        const randomHex = crypto.randomBytes(16).toString('hex');
        const date = Date.now().toString()
        const apiKey = `${name}_${randomHex}${date}`

        return apiKey
    }
    catch (err) {
        console.log(err)
        throw new AppError(
            "SERVER ERROR",
            500,
            "Error generating unique ID",
        );
    }
}

export function generateUUIDv4() {
    const id = UUIDv4();
    return id;
}
