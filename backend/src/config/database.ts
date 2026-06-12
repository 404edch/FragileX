import { Pool } from "pg";
import path from "path";
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });


export const db = new Pool({
    host: process.env.DATABASE_HOST,
    port: 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    max: 15,
    idleTimeoutMillis: 50000,
});