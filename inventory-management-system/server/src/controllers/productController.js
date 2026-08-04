const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { Product, Supplier } = require("../models");

// GET /api/products?search=...&supplierId=...
async function getAllProducts(req, res, next) {
  try {
    const { search, supplierId } = req.query;
    const where = {};

    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }
    if (supplierId) {
      where.supplierId = supplierId;
    }

    const products = await Product.findAll({
      where,
      include: [{ model: Supplier, as: "supplier", attributes: ["id", "name"] }],
      order: [["name", "ASC"]],
    });

    res.json(products);
  } catch (err) {
    next(err);
  }
}

// GET /api/products/:id
async function getProductById(req, res, next) {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Supplier, as: "supplier" }],
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
}

// POST /api/products  (multipart/form-data - includes optional image file)
async function createProduct(req, res, next) {
  try {
    const { name, description, price, quantity, supplierId } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      quantity,
      supplierId: supplierId || null,
      imagePath: req.file ? `/uploads/${req.file.filename}` : null,
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

// PUT /api/products/:id
async function updateProduct(req, res, next) {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const { name, description, price, quantity, supplierId } = req.body;

    // If a new image was uploaded, delete the old one to avoid orphan files
    if (req.file) {
      if (product.imagePath) {
        const oldPath = path.join(__dirname, "..", "..", product.imagePath);
        fs.unlink(oldPath, () => {}); // ignore errors (file may already be gone)
      }
      product.imagePath = `/uploads/${req.file.filename}`;
    }

    product.name = name;
    product.description = description;
    product.price = price;
    product.quantity = quantity;
    product.supplierId = supplierId || null;

    await product.save();
    res.json(product);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/products/:id
async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.imagePath) {
      const imgPath = path.join(__dirname, "..", "..", product.imagePath);
      fs.unlink(imgPath, () => {});
    }

    await product.destroy();
    res.json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
