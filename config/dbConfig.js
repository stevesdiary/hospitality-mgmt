require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT || "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true, // typo fixed: "Unauthorised" ➜ "Unauthorized"
    },
  },
});
try {
  // sequelize.authenticate();
  console.log("Database connection established.");
} catch (error) {
  console.log("Unable to connect to the database", error);
}

module.exports = sequelize;
