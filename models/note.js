const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Note = sequelize.define(
    "Note",
    {
      noteId: {
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
      direction: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
      parking: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
      smoking: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
      etc: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
    },
    {
      tableName: "Note",
      timestamps: false,
    }
  );

  return Note;
};
