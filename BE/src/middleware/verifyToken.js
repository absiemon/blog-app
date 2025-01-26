import jwt from 'jsonwebtoken';
import { AppError, validateParams, ValidationError } from '../utills/errorHandlers.js';
import UserSessionModel from '../schema/userSessions.js';
import { verifyRefreshTokenValidator, verifyTokenValidator} from '../utills/validator.js';
import { jwtPublicKEY } from '../config/appConfig.js';

/**
 * @type {expressParams}
 */
export const verifyToken = async (req, res, next) => {

    const token = req.headers.authorization?.split(' ')[1];
    const session_id = req.headers['session-id'];
    const device_id = req.headers['device-id'];

    try {
        validateParams(verifyTokenValidator, {
            token,
            session_id,
            device_id
        });
    }
    catch (error) {
        if (error instanceof ValidationError) {
            return next(new ValidationError())
        }
        return next(error)
    }


    try {

        //loading public to verify the RSA Signed token
        const publicKey = jwtPublicKEY
        const options = {
            algorithm: ['RS256'],
            issuer: 'ringus',
            audience: 'https://ringus.ai'
        };

        const decoded = jwt.verify(token, publicKey, options)

        if (!decoded) {
            return next(new AppError(
                "BAD_REQUEST",
                401,
                "Unauthorized: User not authenticated"
            ))
        }

        //if there is decoded then check for the expiry of the token.
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded?.exp < currentTime) {
            return next(new AppError(
                "ACCESS_TOKEN_EXPIRED",
                401,
                'Unauthorized: Invalid token or token has been expired'
            ))
        }

        //verify session id.
        const userSessionInfo = await UserSessionModel.findOne({
            session_id,
            user: decoded?._id,
            is_active: true
        });

        if (!userSessionInfo) {
            return next(new AppError(
                "SESSION_EXPIRED",
                401,
                'Unauthorized: Invalid session or session has been expired'
            ))
        }

        const newDecoded = {
            ...decoded,
            session_id,
            device_id: device_id
        }

        req.user = newDecoded;
        next();
    }
    catch (error) {
        return next(new AppError(
            "ACCESS_TOKEN_EXPIRED",
            401,
            'Unauthorized: Invalid token or token has been expired'
        ))
    }
};


/**
 * @type {expressParams}
 */
export const verifyRefreshToken = async (req, res, next) => {

    const refreshToken = req.headers['refresh-token'];
    const session_id = req.headers['session-id'];
    const device_id = req.headers['device-id'];

    try {
        validateParams(verifyRefreshTokenValidator, {
            refreshToken,
            session_id,
            device_id
        });
    }
    catch (error) {
        if (error instanceof ValidationError) {
            return next(new ValidationError())
        }
        return next(error)
    }

    try {

        //loading public to verify the RSA Signed token
        const publicKey = jwtPublicKEY
        const options = {
            algorithm: ['RS256'],
            issuer: 'ringus',
            audience: 'https://ringus.ai'
        };

        const decoded = jwt.verify(refreshToken, publicKey, options)

        if (!decoded) {
            return next(new AppError(
                "BAD_REQUEST",
                401,
                "Unauthorized: User not authenticated"
            ))
        }

        //if there is decoded then check for the expiry of the token.
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded?.exp < currentTime) {
            return next(new AppError(
                "REFRESH_TOKEN_EXPIRED",
                401,
                'Unauthorized: Invalid token or token has been expired'
            ))
        }

        //verify session id.
        const userSessionInfo = await UserSessionModel.findOne({
            session_id,
            refresh_token: refreshToken,
            user: decoded?._id,
            device_id: device_id,
            is_active: true
        });

        if (!userSessionInfo) {
            return next(new AppError(
                "SESSION_EXPIRED",
                401,
                'Unauthorized: Invalid session or session has been expired'
            ))
        }

        const newDecoded = {
            ...decoded,
            session_id,
            device_id: device_id
        }

        req.user = newDecoded;
        next();
    }
    catch (error) {
        return next(new AppError(
            "REFRESH_TOKEN_EXPIRED",
            401,
            'Unauthorized: Invalid token or token has been expired'
        ))
    }
};
