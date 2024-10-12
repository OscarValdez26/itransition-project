import { createPool } from 'mysql2/promise';
import 'dotenv/config';

export const pool = createPool({
    host: process.env.DB_URL,
    user: process.env.DB_USERNAME,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});