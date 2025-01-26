export const errorHandler = ({ res, errorCode, statusCode, message = '', data = null, status = 'Failed' }) => {
    return res.status(statusCode).json({
        errorCode,
        message,
        status,
        data
    });
};

export const handleJoiError = (error, res) => {
    errorHandler({
        res,
        errorCode: "VALIDATION_ERROR",
        statusCode: 400,
        message: 'Bad request: Validation failed'
    })
}

const errorCodes = [
    "UNKNOWN_EXCEPTION",
    "NOT_FOUND",
    "BAD_REQUEST",
    "ACCESS_TOKEN_EXPIRED",
    "REFRESH_TOKEN_EXPIRED",
    "SESSION_EXPIRED",
    "SERVER_ERROR",
    "VALIDATION_ERROR",
    "ACCESS_TOKEN_ERROR",
    "PERMISSION_DENIED",
]


export class AppError extends Error {
    /**
     * Custom Error class to handle different types of errors
     * @param {string} errorCode - Unique error code for identifying the error.
     * @param {number} statusCode - HTTP status code to be sent with the response.
     * @param {string} message - A human-readable error message.
     * @param {object} data - Additional data or context for the error.
     * @param {string} status - Status message (e.g., 'Failed', 'Success').
     */
    constructor(
        errorCode = 'UNKNOWN_EXCEPTION',
        statusCode = 500,
        message = 'Something went wrong.',
        data = null,
        status = 'Failed'
    ) {
        // Ensure errorCode is valid
        if (!errorCodes.includes(errorCode)) {
            errorCode = 'UNKNOWN_EXCEPTION'; // Default to a known error code or throw an error
        }

        super(message); // Call the base Error constructor with the message
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.data = data;
        this.status = status;

        // Ensure the name of this error is the same as the class name (CustomError)
        this.name = this.constructor.name;

        // Capture the stack trace (without including the constructor call)
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    /**
    * Validation Error class that extends AppError
    * @param {string} [message='Bad request: Validation failed'] - A human-readable error message.
    * @param {string} [errorCode='VALIDATION_ERROR'] - Optional error code (defaults to 'VALIDATION_ERROR').
    * @param {number} [statusCode=400] - Optional HTTP status code (defaults to 400).
    * @param {object} [data=null] - Optional additional data (defaults to null).
    * @param {string} [status='Failed'] - Optional status message (defaults to 'Failed').
    */
    constructor(
        message,
        errorCode = 'VALIDATION_ERROR',
        statusCode = 400,
        data = null,
        status = 'Failed'
    ) {
        // Make sure the errorCode is valid for ValidationError
        if (!errorCodes.includes(errorCode)) {
            errorCode = 'VALIDATION_ERROR'; // Default to validation error code if invalid
        }

        super(errorCode, statusCode, message, data, status);
    }
}

/**
 * Centralized error handling middleware.
 * Catches all errors, including validation and custom errors.
 * @param {Error} err - The error object.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {Function} next - Next middleware function.
 */
export function appErrorHandler(err, req, res, next) {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Something went wrong';
    let errorCode = err.errorCode || 'UNKNOWN_EXCEPTION';
    let data = err.data || null;
    let status = err.status || 'Failed';

    if (err instanceof ValidationError) {
        statusCode = err.statusCode || 400;
        errorCode = err.errorCode || 'VALIDATION_ERROR';
        message = err.message || 'Bad request: Validation failed';
    }
    else if (!(err instanceof AppError)) {
        console.error('Unexpected Error:', err); // Log the unexpected error
        message = 'Something went wrong. Please try again later.';
    }

    // Send the error response in a structured, user-friendly format
    return res.status(statusCode).json({
        success: false,
        errorCode,
        statusCode,
        message,
        data,
        status,
    });
}


/**
 * @param {Object} schema - Joi validation schema
 * @param {Object} data - Data to be validated
 */
export function validateParams(schema, data) {
    const { error } = schema.validate(data);
    if (error) {
        throw new ValidationError(error.details[0].message)
    }
    return true
}
