const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

// This is the dedicated "user entity" the brief requires, separate from
// business data (Products/Suppliers). Only this table is used for login.
class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { notEmpty: true },
    },
    // We NEVER store the plain password. Only the bcrypt hash goes here.
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "admin",
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
  }
);

module.exports = User;
