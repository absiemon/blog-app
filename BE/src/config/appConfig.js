import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import path from 'path';
const __dirname = path.resolve();

// PRODUCTION CONFIGS
export const PROD_CORS_ALLOWED_ORIGIN = ['https://blog-app-client-rjyc.onrender.com', 'https://blog-app-client-rjyc.onrender.com/']
export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME || ''
export const PROD_COOKIE_DOMAIN = process.env.PROD_COOKIE_DOMAIN || ''

// DEVELOPMENT CONFIG 
export const DEV_CORS_ALLOWED_ORIGIN = ['http://localhost:3000', 'http://localhost:5173'];
export const DEV_MONGO_URI = 'mongodb://localhost:27017/test';
export const DEV_AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || '';
export const DEV_AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || '';
export const DEV_AWS_REGION = 'ap-south-1';
export const DEV_COOKIE_DOMAIN = 'localhost';


export const accessLogStream = fs.createWriteStream(path.join(__dirname, './src/logs/api_log.log'), { flags: 'a' })
export const jwtPublicKEY = fs.readFileSync(path.resolve(__dirname, '', './src/keys/public.key'), 'utf8');

export const refreshTokenExpiry = 30 * 24 * 60 * 60 * 1000;  // 30 days

export const secureCookieSettings = {
    httpOnly: true,
    secure: true,
    sameSite: 'None', //'None'
    path: '/',
    domain: process.env.NODE_ENV === 'PRODUCTION' ? PROD_COOKIE_DOMAIN : DEV_COOKIE_DOMAIN,
    maxAge: refreshTokenExpiry
}

export const unSecureCookieSettings = {
    secure: true,
    sameSite: 'None', //'None'
    path: '/',
    domain: process.env.NODE_ENV === 'PRODUCTION' ? PROD_COOKIE_DOMAIN : DEV_COOKIE_DOMAIN,
}


export const roles = {
    ADMIN: "ADMIN",
    USER: "USER"
}

export const blogStatuses = {
    ACTIVE: 'ACTIVE',
    PENDING: 'PENDING',
    SUSPENDED: 'SUSPENDED',
}

export const verificationTokenSecKey = process.env.VERIFICATION_TOKEN_SEC_KEY || '*(!@(N)8nc08ans092';
export const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000'