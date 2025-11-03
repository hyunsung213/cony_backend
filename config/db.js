const { Sequelize } = require("sequelize");
require("dotenv").config();

// const sequelize = new Sequelize("mydb", "devuser", "devpass", {
//   host: "localhost",
//   dialect: "mysql", // 또는 'mariadb'
//   port: 3306,
// });

const sequelize = new Sequelize(
  process.env.DB_NAME, // database
  process.env.DB_USER, // username
  process.env.DB_PASSWORD, // password
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Supabase는 SSL 필요
      },
    },
    logging: false,
  }
);

module.exports = sequelize;
