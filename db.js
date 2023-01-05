"use strict";

/** Database setup for BizTime. */

const { Client } = require("pg");

// DB_URI definition for nico
const DB_URI = process.env.NODE_ENV === "test"
? "postgresql://nicom:nicom@localhost/biztime_test"
: "postgresql://nicom:nicom@localhost/biztime"

// DB_URI definition for chalon
// const DB_URI = process.env.NODE_ENV === "test"
//     ? "postgresql:///biztime"
//     : "postgresql:///biztime_test"

let db = new Client({
    connectionString: DB_URI
})

db.connect();

module.exports = db;