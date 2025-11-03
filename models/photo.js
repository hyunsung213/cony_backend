const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Photo = sequelize.define(
    "Photo",
    {
      photoId: {
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
      photoUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "Photo",
      timestamps: false,
    }
  );

  return Photo;
};
