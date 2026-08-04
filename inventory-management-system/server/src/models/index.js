const sequelize = require("../config/db");
const User = require("./User");
const Supplier = require("./Supplier");
const Product = require("./Product");

// --- Relationships (this is the "code-first" schema) ---
// One Supplier can supply many Products.
// This creates a `supplierId` foreign key column on the products table.
Supplier.hasMany(Product, {
  foreignKey: "supplierId",
  onDelete: "SET NULL", // if a supplier is deleted, its products aren't deleted, just unlinked
});
Product.belongsTo(Supplier, {
  foreignKey: "supplierId",
  as: "supplier",
});

module.exports = { sequelize, User, Supplier, Product };
