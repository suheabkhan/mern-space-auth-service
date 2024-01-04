import { config } from 'dotenv';

import path from 'path';

// This is to ensure , the .env files are read different for each environment
config({ path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`) });

const {
    PORT,
    NODE_ENV,
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_USERNAME,
    DB_PASSWORD,
    REFRESH_TOKEN_SECRETKEY,
} = process.env;

export const Config = {
    PORT,
    NODE_ENV,
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_USERNAME,
    DB_PASSWORD,
    REFRESH_TOKEN_SECRETKEY,
};
