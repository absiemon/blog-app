import { generateRefreshToken, generateToken } from '../utills/JwtHandler.js';
import UserModel from '../schema/user.js'
import { validateRegister, validateLogin } from './validator.js'
import { generateUUIDv4 } from '../utills/handlerFunctions.js';
import { AppError, ValidationError } from '../utills/errorHandlers.js';
import userService from '../user/service.js';
import UserSessionModel from '../schema/userSessions.js';
import { secureCookieSettings, unSecureCookieSettings } from '../config/appConfig.js';
import bcrypt from 'bcryptjs';

/**
 * @type {expressParams}
 */
//API for User Registration 
export const registerUser = async (req, res, next) => {

    //validate request body
    const { error } = validateRegister(req.body)
    if (error) {
        return next(new ValidationError(error.message))
    }

    const { email, password, device_info, ...rest } = req.body;

    let newUser = null;
    //getting the user device id for session persistance.
    let user_device_id = req.headers['device-id'];

    try {
        //if user device id is there then don't generate a device id.(This specifically for Web)
        if (!user_device_id) {
            user_device_id = generateUUIDv4()
        }

        // Check if the email is already registered
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return next(new AppError(
                "BAD_REQUEST",
                400,
                "Email is already associated with another account"
            ))
        }

        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(password, salt);

        //creating user in mongoDB
        newUser = await UserModel.create({
            email,
            password: secPassword,
            ...rest
        })

        console.log("new user created", newUser)

        // Generating token
        const payload = {
            _id: newUser._id,
            email,
            name: newUser?.name,
            role: newUser?.role
        }

        const token = await generateToken(payload);
        const refreshToken = await generateRefreshToken(payload);

        //create user session data.
        const createSessionData = {
            user: newUser._id?.toString(),
            device_info,
            device_id: user_device_id,
            refresh_token: refreshToken,
        }

        //creating user session
        const sessionData = await userService.createUserSession(createSessionData)

        //setting some cookies data
        res.cookie('refreshToken', refreshToken, secureCookieSettings);
        res.cookie('deviceId', user_device_id, unSecureCookieSettings);

        return res.status(201).json({
            data: newUser,
            accessToken: token,
            session: sessionData
        });
    }
    catch (error) {
        //rolling back if error occurred
        await UserModel.findByIdAndDelete(newUser._id);

        return next(error)
    }

};

/**
 * @type {expressParams}
 */
//Api for login user    
export const loginUser = async (req, res, next) => {

    try {
        //validate request body
        const { error } = validateLogin(req.body)

        if (error) {
            return next(new ValidationError())
        }

        const { email, password, device_info } = req.body;

        //getting the user device id for session persistance.
        let user_device_id = req.headers['device-id'];

        //if user device id is there then don't generate a device id.(This specifically for Web)
        if (!user_device_id) {
            user_device_id = generateUUIDv4()
        }

        // Find the user by firebase id in the mongodb
        const user = await UserModel.findOne({ email: email }).select('name email password role last_login email_verified')

        if (!user) {
            return next(new AppError(
                "NOT_FOUND",
                404,
                'User account not found'
            ))
        }

        const passwordCompare = await bcrypt.compare(password, user.password);

        if (!passwordCompare) {
            return next(new AppError(
                "BAD_REQUEST",
                404,
                'Invalid credentials'
            ))
        }

        // Generating token
        const payload = {
            _id: user._id,
            email: user.email,
            name: user.name,
            role: user.role
        }

        try {
            const token = await generateToken(payload)
            const refreshToken = await generateRefreshToken(payload)

            //saving data for the user
            user.last_login = new Date();
            await user.save()

            const createSessionData = {
                user: user._id.toString(),
                device_info,
                device_id: user_device_id,
                refresh_token: refreshToken,
            }

            //creating user session
            const sessionData = await userService.createUserSession(createSessionData)

            //setting some cookies data
            res.cookie('refreshToken', refreshToken, secureCookieSettings);
            res.cookie('deviceId', user_device_id, unSecureCookieSettings);

            const newUser = user?.toObject()
            const { password, ...restUser } = newUser

            return res.status(200).json({
                data: restUser,
                accessToken: token,
                session: sessionData,
            });
        }
        catch (error) {
            console.log(error)
            return next(new AppError(
                "ACCESS_TOKEN_ERROR",
                500,
                "Something went wrong."
            ))
        }
    }
    catch (error) {
        //pass default error to error handler
        return next(error)
    }
};


/**
 * @type {expressParams}
 */
export const resetPassword = async (req, res, next) => {

    try {
        const data = req.body;
        const email = data.email;

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return next(new AppError(
                "BAD_REQUEST",
                400,
                'Invalid email address'
            ))
        }

        const user = await UserModel.findOne(
            { email: email },
        );
        if (!user) {
            return next(new AppError(
                "NOT_FOUND",
                404,
                'User account not found'
            ))
        }
        return res.status(200).json({ data: "Password reset link sent successfully." });

    }
    catch (error) {
        //pass default error to error handler
        return next(error)
    }
};

/**
 * @type {expressParams}
 */
//get access token from refresh token
export const getAccessToken = async (req, res, next) => {

    try {
        const refreshToken = req.cookies.refreshToken;
        const userId = req.user?._id;

        const userData = await UserModel.findById(userId)

        if (!userData) {
            return next(new AppError(
                "NOT_FOUND",
                404,
                'User account not found'
            ))
        }

        //If everything goes well then get the new access token
        const payload = {
            _id: userData._id,
            email: userData.email,
            name: userData.first_name,
            role: userData?.role,
        }

        try {
            const token = await generateToken(payload)

            userData.last_login = new Date();
            await userData.save()

            return res.status(200).json({
                data: userData,
                accessToken: token,
                newRefreshToken: refreshToken
            });
        }
        catch (error) {
            return next(new AppError(
                "ACCESS_TOKEN_ERROR",
                500,
            ))
        }

    }
    catch (error) {
        //pass default error to error handler
        return next(error)
    }
};



/**
 * @type {expressParams}
 */

export const logoutUser = async (req, res, next) => {
    try {
        //getting the session if from headers.
        const session_id = req.headers['session-id'];
        if (!session_id) {
            return next(new AppError(
                "BAD_REQUEST",
                400,
                'Missing session_id.'
            ))
        }
        //deleting the user session.
        await UserSessionModel.findOneAndUpdate(
            {
                session_id: session_id
            },
            {
                $set: {
                    is_active: false,
                    refresh_token: null,
                }
            }
        )

        // Clearing some cookie
        res.clearCookie('refreshToken', secureCookieSettings);

        return res.status(200).json({
            data: "User logged out successfully"
        });
    }
    catch (error) {
        //pass default error to error handler
        return next(error)
    }
}

/**
 * @type {expressParams}
 */
export const logoutUserFromADevice = async (req, res, next) => {
    try {
        //getting the session_if for the device.
        const { session_id } = req.body;
        if (!session_id) {
            return next(new AppError(
                "BAD_REQUEST",
                400,
                'Missing session_id.'
            ))
        }

        await UserSessionModel.findOneAndUpdate(
            {
                session_id: session_id
            },
            {
                $set: {
                    is_active: false,
                    refresh_token: null,
                }
            }
        )

        return res.status(200).json({
            data: null,
            message: "User logged out successfully"
        });
    }
    catch (error) {
        //pass default error to error handler
        return next(error)
    }
}


/**
 * @type {expressParams}
 */
export const logoutUserFromAllSessions = async (req, res, next) => {
    try {
        //getting the user id after token validation.
        const userId = req?.user?._id;

        //deleting the user session.
        await UserSessionModel.updateMany(
            {
                user: userId,
            },
            {
                $set: {
                    is_active: false,
                    refresh_token: null,
                }
            }
        )
        return res.status(200).json({
            data: null,
            message: "User logged out successfully from all devices."
        });
    }
    catch (error) {
        //pass default error to error handler
        return next(error)
    }
}