const { Pool } = require("pg");
const ENV = process.env.NODE_ENV !== "test";

require("dotenv").config({
    path: ENV ? `.env.development` : `.env.test`,
});

if (!process.env.PGDATABASE) {
    throw new Error("PGDATABASE not set");
}

module.exports = new Pool();
