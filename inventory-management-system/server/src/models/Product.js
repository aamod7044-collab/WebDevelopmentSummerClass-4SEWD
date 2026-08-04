const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Product extends Model {}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: "Product name is required" } },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: { args: [0], msg: "Price cannot be negative" },
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: { args: [0], msg: "Quantity cannot be negative" },
      },
    },
    // Path to the uploaded image file, e.g. /uploads/1699999999-photo.jpg
    imagePath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Foreign key to Supplier - added automatically by the association
    // in models/index.js (Product.belongsTo(Supplier))
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
  }
);

module.exports = Product;
