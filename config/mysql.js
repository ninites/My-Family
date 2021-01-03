require("dotenv").config();
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "us-cdbr-east-02.cleardb.com",
  user: "b2ebf19fe0e827",
  database: "heroku_fd111ed9b274f69",
  password: "4faacfdf",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const connection = pool.promise();

module.exports = { connection };
