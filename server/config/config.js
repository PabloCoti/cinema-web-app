require('dotenv').config();

const dbConfig = {
  "username": process.env.DB_USER,
  "password": process.env.DB_PASSWORD,
  "database": process.env.DB_DATABASE,
  "host": process.env.DB_HOST,
  "dialect": "mysql",
  "migrationStorageTableName": "migrations"
};

module.exports = {
  "local": dbConfig,
  "production": dbConfig,
};