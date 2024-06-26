require("dotenv").config();
const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "store",
  password: "postgres",
  port: process.env.DB_PORT,
});

module.exports = pool;
