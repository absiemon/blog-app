import MongoStore from "connect-mongo";
import express from "express";
import rateLimit from "express-rate-limit";
import session from "express-session";
import { DEV_CORS_ALLOWED_ORIGIN, PROD_CORS_ALLOWED_ORIGIN } from "../config/appConfig.js";

// ----------------function to detect if a string is Base64 encoded-------------
export const isBase64 = (str) => {
    try {
        return Buffer.from(str, 'base64').toString('base64') === str;
    } catch (err) {
        return false;
    }
};

// ---------------middleware to handle Base64 decoded body--------------------
export const handleBase64Body = (req, res, next) => {
    if (req.body && typeof req.body === 'string' && isBase64(req.body)) {
        try {
            const decodedBody = Buffer.from(req.body, 'base64').toString('utf-8');
            req.body = JSON.parse(decodedBody);
        }
        catch (error) {
            console.error('Error decoding Base64 body:', error);
        }
    }
    next();
};

//-------------middleware for express json------------------------------------
export const expressJson = express.json({
    limit: '5mb',
    verify: (req, res, buf, encoding) => {
        try {
            if (req.headers['content-type'] === 'application/json' ||
                req.headers['content-type'] === 'application/json; charset=utf-8') {
                const rawBody = buf.toString(encoding);

                // Check if the body is Base64 encoded
                if (isBase64(rawBody)) {
                    try {
                        const decodedBody = Buffer.from(rawBody, 'base64').toString('utf-8');
                        req.rawBody = decodedBody;
                    }
                    catch (error) {
                        req.rawBody = rawBody;
                    }
                }
                else {
                    req.rawBody = rawBody;
                }
            }
            else {
                throw new Error('Invalid content type');
            }
        } catch (err) {
            res.status(400).send({
                error: 'Invalid request payload',
            });
            throw new Error('Invalid request payload');
        }
    },
});

// ----------bodyParser middleware configuration------------------
export const bodyParserConfig = {
    json: {
        limit: '50mb',
        parameterLimit: 100000,
        verify: (req, res, buf, encoding) => {
            if (buf.length) {
                const stringBody = buf.toString(encoding);
                if (isBase64(stringBody)) {
                    try {
                        const decodedBody = Buffer.from(stringBody, 'base64').toString('utf-8');
                        req.rawBody = decodedBody;
                    }
                    catch (error) {
                        req.rawBody = stringBody;
                    }
                }
                else {
                    req.rawBody = stringBody;
                }
            }
        }
    },
    urlencoded: {
        limit: '50mb',
        extended: true,
        parameterLimit: 100000
    }
};


//--------------middleware for rate limiting--------------------------------------
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
    handler: (req, res, next) => {
        console.log('rate limit exceeded')
        return res.status(429).json({
            errorCode: 'BAD_REQUEST',
            message: 'Too many requests from this IP, please try again after 15 minutes!'
        });
    }
});

//---------------------------------------------------------------------------------


//--------middleware for express session --------

export const expressSession = session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions',
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'PRODUCTION' ? true : false,
        maxAge: 10 * 60 * 1000
    } // 10 minutes expiration,
})
//----------------------------------------------------------------------


//----------------middleware for cors-----------------------------------
const allowedOrigins = process.env.NODE_ENV === 'PRODUCTION' ? PROD_CORS_ALLOWED_ORIGIN : DEV_CORS_ALLOWED_ORIGIN;
export const corsOptions = {
    credentials: true,
    origin: function (origin, callback) {

        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET, POST, PUT, DELETE, PATCH',
    allowedHeaders: 'Content-Type, Authorization, Cookie, session-id, device-id, refresh-token'
};

export const verifyOurOrigin = (req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        next();
    }
    else {
        return res.status(403).json({ message: 'Origin not allowed' });
    }
};
