const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Payment = sequelize.define(
    "Payment",
    {
      paymentId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      gameId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Game",
          key: "gameId",
        },
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userPhoneNum: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userEmail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isConfirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "Payment",
      timestamps: true,
    }
  );

  return Payment;
};
