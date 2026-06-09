import { Pool } from "pg";
require('dotenv').config({ path: __dirname+'/.env' });


export const db = new Pool({
    host: process.env.DATABASE_HOST,
    port: 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    max: 15,
    idleTimeoutMillis: 50000,
});