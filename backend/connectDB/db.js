import pg from 'pg';
import dotenv from 'dotenv'
const {Pool} = pg
dotenv.config();

export const pool = new Pool({
    // user: process.env.DB_USER,
    // host: process.env.DB_HOST,
    // database: process.env.DB_NAME,
    // password: process.env.DB_PASSWORD,
    // port: Number(process.env.DB_PORT),
    connectionString: process.env.DATABASE_URL,
  //   ssl: {
  //   rejectUnauthorized: false,
  // },
})

async function testDB() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log(result.rows);
  } catch (err) {
    console.log(err);
  }
}

testDB();