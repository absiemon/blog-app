import { AppError } from '../utills/errorHandlers.js';
import { generateUniqueId } from '../utills/handlerFunctions.js';
import mongoose from 'mongoose';
import { Types } from 'mongoose';
import User from '../schema/user.js';
import { generateVerificationToken, verifyVerificationToken } from '../utills/verificationToken.js';
import { clientUrl } from '../config/appConfig.js';
import { validateCreateUserSessionParameters } from './validator.js';
import UserSession from '../schema/userSessions.js';

class UserService {
    async getSingleUser(userId) {
        const user = await User.findById(userId)

        if (!user) {
            return next(new AppError(
                "NOT_FOUND",
                404,
                'User account not found'
            ))
        }

        let dataToSend = user.toObject();

        return dataToSend;
    }

    async createUserSession(data) {

        const { error } = validateCreateUserSessionParameters(data)
        if (error) {
            throw new ValidationError(error.details[0].message)
        }

        const { device_info, user, refresh_token, device_id } = data;
        //We can add constraint on number of active session of the user

        //creating the session id.
        //generating the api key for the user
        const session_id = await generateUniqueId('sessionId')

        //make the expiry of the session 30d from now on
        const expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        const logged_in_at = new Date();

        //if the session is already there for a user and device_id then just update the 
        // the session else create a new session.
        const existingSession = await UserSession.findOne({ user: user, device_id: device_id })
        if (existingSession) {
            existingSession.logged_in_at = logged_in_at;
            existingSession.is_active = true;
            existingSession.refresh_token = refresh_token;
            existingSession.save();

            return existingSession;
        }
        else {
            const sessionData = await UserSession.create({
                session_id,
                user,
                device_info,
                device_id,
                expires_at,
                refresh_token
            })
            return sessionData;
        }

    }

    async getUserSessions(userId, sessionId) {

        //Use aggregation to get user sessions
        const userSessions = await UserSession.aggregate([
            {
                $match: { user: new Types.ObjectId(userId) }
            },
            {
                $addFields: {
                    is_current_device: {
                        $cond: { if: { $eq: ["$session_id", sessionId] }, then: true, else: false }
                    }
                }
            },
            { $match: { is_active: true } },
            { $sort: { is_current_device: -1 } }  // Sort with `is_current_device: true` first
        ]);

        return userSessions
    }

    async sendEmailVerificationLink(userId, email) {

        // Check if user email already verified
        const user = await User.findOne({
            _id: userId,
            email_verified: true,
        });

        if (user) {
            throw new AppError(
                "BAD_REQUEST",
                400,
                'Email already verified.'
            );
        }

        // Generate verification token and link
        const verificationToken = await generateVerificationToken(
            email,
            userId,
        );
        const inviteLink = `${clientUrl}/user/verify-email?verification_token=${verificationToken}`;

        // Prepare email
        const templatePath = path.join(__dirname, '/src/assets/inviteEmailTemplate.html');
        let emailTemplate = fs.readFileSync(templatePath, 'utf8');
        emailTemplate = emailTemplate.replace('{{inviteLink}}', inviteLink);

        const mailOptions = {
            from: 'BlogApp siemonab@gmail.com',
            to: email,
            subject: `Verify your email for BlogApp`,
            html: emailTemplate,
        };

        // Send email
        try {
            const transporter = nodeMailerTransporter();
            await transporter.sendMail(mailOptions);
        }
        catch (error) {
            console.error('Error sending email: ' + error);
        }
        return {};
    }

    async verifyEmailVerification(verificationToken) {
        try {

            const { decoded } = await verifyVerificationToken(verificationToken);
            const { email, user_id } = decoded;

            // Check if user email already verified
            const user = await User.findOne({
                email: email,
                _id: user_id,
                email_verified: true
            });

            if (user) {
                throw new AppError(
                    "BAD_REQUEST",
                    400,
                    'The verification was already done'
                );
            }

            await User.findOneAndUpdate(
                {
                    _id: user_id,
                    email: email
                },
                { email_verified: true }
            );

            return decoded;
        }
        catch (error) {
            throw new AppError(
                "BAD_REQUEST",
                400,
                "We couldn't find the verification you were looking for, it may have been deleted"
            );
        }
    }


}

export default new UserService()
