require("dotenv").config();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DATABASE,
    connectionLimit: process.env.CONLIMIT,
})

module.exports = pool;