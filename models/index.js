const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST, // <- session-pooler 주소!
    port: Number(process.env.DB_PORT),
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  }
);

// 모델 불러오기
const Place = require("./place")(sequelize);
const Game = require("./game")(sequelize);
const Note = require("./note")(sequelize);
const Option = require("./option")(sequelize);
const Photo = require("./photo")(sequelize);
const Payment = require("./payment")(sequelize);

// 관계 설정

// 1. Place - Game (1:N)
Place.hasMany(Game, { foreignKey: "placeId" });
Game.belongsTo(Place, { foreignKey: "placeId" });

// 2. Place - Option (1:1)
Place.hasOne(Option, { foreignKey: "placeId" });
Option.belongsTo(Place, { foreignKey: "placeId" });

// 3. Game - Payment (1:N 관계)
Game.hasMany(Payment, { foreignKey: "gameId", onDelete: "CASCADE" });
Payment.belongsTo(Game, { foreignKey: "gameId" });

// 4. Place - Photo (1:N 관계)
Place.hasMany(Photo, { foreignKey: "placeId", onDelete: "CASCADE" });
Photo.belongsTo(Place, { foreignKey: "placeId" });

// 5. Place - Note (1:N 관계)
Place.hasOne(Note, { foreignKey: "placeId", onDelete: "CASCADE" });
Note.belongsTo(Place, { foreignKey: "placeId" });

module.exports = {
  sequelize,
  Place,
  Game,
  Option,
  Photo,
  Note,
  Payment,
};
