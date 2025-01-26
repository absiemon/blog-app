import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import flash from 'connect-flash';

import { connectToMongoDB } from "./src/config/mongoConfig.js";
//middleware configuration import
import { apiLimiter, bodyParserConfig, corsOptions, expressJson, expressSession, handleBase64Body } from './src/middleware/appMiddleware.js'

import mainIndexRouter from './src/mainIndexRoute.js'

import { accessLogStream } from './src/config/appConfig.js';
import { appErrorHandler } from './src/utills/errorHandlers.js';
import './src/utills/expressTypes.js'
import { seedCategories } from './src/seeding/seedCategory.js';
import { seedBlogs } from './src/seeding/seedBlog.js';

// setting up express server
const app = express();

// Session middleware with persistent store.
app.use(expressSession);

//middleware to accept and send json req res
app.use(expressJson);

// middleware to handle Base64 encoded bodies
app.use(handleBase64Body);

//middleware to parse cookies
app.use(cookieParser())

// middleware to parse body which comes in request
app.use(bodyParser.urlencoded(bodyParserConfig.urlencoded))
app.use(bodyParser.json(bodyParserConfig.json))

//middleware to parse body which comes in request
app.use(bodyParser.json({
    parameterLimit: 100000,
    limit: '50mb'
}))

// middleware to show flash messages
app.use(flash());

//middleware to log the request coming from an IP on console
app.use(morgan('combined',
    {
        stream: accessLogStream
    }
))

// Security middleware for express server
app.disable('etag')
app.disable('x-powered-by');
app.use(helmet())

// Connect to MongoDB
await connectToMongoDB();

//seeding 
const seedDatabase = async () => {
    await seedCategories();
    await seedBlogs();
};

seedDatabase();

//TEST API to check whether server is running or not
app.get('/', async (req, res, next) => {
    return res.status(200).json("Server is running")
});

//main router protected with cors with specified origin
app.use('/api', cors(corsOptions), apiLimiter, mainIndexRouter);


// Error handling middleware.
app.use(appErrorHandler);

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`listening on port ${port}`)
});
