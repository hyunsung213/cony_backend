const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Option = sequelize.define(
    "Option",
    {
      optionId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      placeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Place",
          key: "placeId",
        },
        onDelete: "CASCADE",
      },
      isToilet: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isShowerRoom: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isParkingLot: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isShuttlecock: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isIndoor: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isWater: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "Option",
      timestamps: false,
    }
  );

  return Option;
};
