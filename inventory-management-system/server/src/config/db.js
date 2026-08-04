const path = require("path");
const { Sequelize } = require("sequelize");

// SQLite stores the whole database in a single file on disk.
// This keeps everything in server/data/inventory.sqlite
const storagePath = path.join(__dirname, "..", "..", "data", "inventory.sqlite");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: storagePath,
  logging: false, // set to console.log if you want to see raw SQL queries
});

module.exports = sequelize;
