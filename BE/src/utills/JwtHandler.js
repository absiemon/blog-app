import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { validateParams } from './errorHandlers.js';
import { genAccessTokenValidator } from './validator.js';

const __dirname = path.resolve();
const ObjectId = mongoose.Types.ObjectId;

//Generate jwt token using RSA algorithm
/**
 * @param {object} payload - object payload
 * @param {ObjectId} [payload._id] - mongoDB _id
 * @param {string} [payload.email] - user email
 * @param {string} [payload.name] - user  name
 * @param {string} [payload.role] - user role
 */

export async function generateToken(payload) {

  validateParams(genAccessTokenValidator, payload)

  try {
    //loading private key for RSA algorithm
    const privateKEY = fs.readFileSync(path.resolve(__dirname, '', './src/keys/private.key'), 'utf8');

    const options = {
      algorithm: 'RS256',
      expiresIn: '3d',
      issuer: 'ringus',
      audience: 'https://ringus.ai'
    };

    const token = jwt.sign(payload, privateKEY, options);

    return token
  }
  catch (err) {
    console.log(err)
    throw new Error(err);
  }
}

/**
 * @param {object} payload - object payload
 * @param {ObjectId} [payload._id] - mongoDB _id
 * @param {string} [payload.email] - user email
 * @param {string} [payload.name] - user name
 * @param {string} [payload.role] - user role
 */

export async function generateRefreshToken(payload) {

  validateParams(genAccessTokenValidator, payload)

  try {
    //loading private key for RSA algorithm
    const privateKEY = fs.readFileSync(path.resolve(__dirname, '', './src/keys/private.key'), 'utf8');

    const options = {
      algorithm: 'RS256',
      expiresIn: '5d',
      issuer: 'ringus', // Issuer claim
      audience: 'https://ringus.ai' // Audience claim
    };

    const token = jwt.sign(payload, privateKEY, options);

    return token
  }
  catch (err) {
    console.log(err)
    throw new Error(err);
  }
}
