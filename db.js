import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

let pool;

if (process.env.DATABASE_URL) {
  // 1. If DATABASE_URL exists (Neon/Render), use it with SSL
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  console.log("Using Neon Cloud Database");
} else {
  // individual local variables
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    // Local Postgres usually doesn't need SSL
    ssl: false 
  });
  console.log("Using Local PostgreSQL Database");
}

export default pool;