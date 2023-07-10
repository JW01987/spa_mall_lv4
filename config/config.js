require("dotenv").config();
const { DB_USER_NAME, DB_PASSWORD, DB_NAME, DB_HOST, DB_DIALECT } = process.env;

const development = {
  username: DB_USER_NAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  host: DB_HOST,
  dialect: DB_DIALECT,
};
const test = {
  username: DB_USER_NAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  host: DB_HOST,
  dialect: DB_DIALECT,
};
const production = {
  username: DB_USER_NAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  host: DB_HOST,
  dialect: DB_DIALECT,
};

module.exports = { development, production, test };
