"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const client = new pg_1.Pool({
    host: process.env.BASE_DB_HOST,
    port: Number(process.env.BASE_DB_PORT),
    user: process.env.BASE_DB_USER,
    password: process.env.BASE_DB_PASSWORD,
    database: process.env.BASE_DB_DATABASE
});
client.connect((err) => {
    if (err) {
        console.error('An error occurred while connecting to: ', err.message);
    }
    else {
        console.log('Connected to Base DB');
    }
});
exports.default = client;
