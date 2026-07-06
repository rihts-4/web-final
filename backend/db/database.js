const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const db = new Database("database.db");

const schema = fs.readFileSync(
    path.join(__dirname, "schema.sql"),
    "utf8"
);

db.exec(schema);

module.exports = db;