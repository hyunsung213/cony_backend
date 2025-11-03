const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Game = sequelize.define(
    "Game",
    {
      gameId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // PostgreSQL에서는 SERIAL 역할 수행
      },
      placeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Place",
          key: "placeId",
        },
      },
      date: {
        type: DataTypes.DATE, // TIMESTAMP in PostgreSQL
        allowNull: true,
      },
      numOfMember: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      cost: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      isRecruiting: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      isFinished: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "Game",
      timestamps: true, // createdAt, updatedAt 포함
    }
  );

  return Game;
};
