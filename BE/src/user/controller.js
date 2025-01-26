import userService from './service.js';

/**
 * @type {expressParams}
 */
export const getSingleUser = async (req, res, next) => {

    try {
        const userId = req?.user?._id;
        const dataToSend = await userService.getSingleUser(userId)

        return res.status(200).json({ data: dataToSend });
    }
    catch (error) {
        return next(error);
    }
}


/**
 * @type {expressParams}
 */
export const getUserSession = async (req, res, next) => {

    try {
        const userId = req?.user?._id;
        const sessionId = req.user?.session_id;

        const dataToSend = await userService.getUserSessions(userId, sessionId)

        return res.status(200).json({ data: dataToSend });
    }
    catch (error) {
        return next(error);
    }
}

/**
 * @type {expressParams}
 */
export const sendEmailVerificationLink = async (req, res, next) => {

    try {
        const userId = req?.user?._id;
        const email = req.user?.email;

        const dataToSend = await userService.sendEmailVerificationLink(userId, email)

        return res.status(200).json({
            data: dataToSend,
            message: "Email verification link sent successfully."
        });
    }
    catch (error) {
        return next(error);
    }
}


/**
 * @type {expressParams}
 */
export const verifyEmail = async (req, res, next) => {

    try {
        const verificationToken = req.data?.verification_token

        const dataToSend = await userService.verifyEmailVerification(verificationToken)

        return res.status(200).json({
            data: dataToSend,
            message: "Email verified successfully."
        });
    }
    catch (error) {
        return next(error);
    }
}
