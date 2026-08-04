const { Supplier, Product } = require("../models");

// GET /api/suppliers
async function getAllSuppliers(req, res, next) {
  try {
    const suppliers = await Supplier.findAll({ order: [["name", "ASC"]] });
    res.json(suppliers);
  } catch (err) {
    next(err);
  }
}

// GET /api/suppliers/:id
async function getSupplierById(req, res, next) {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });
    res.json(supplier);
  } catch (err) {
    next(err);
  }
}

// POST /api/suppliers
async function createSupplier(req, res, next) {
  try {
    const { name, contactEmail, phone } = req.body;
    const supplier = await Supplier.create({ name, contactEmail, phone });
    res.status(201).json(supplier);
  } catch (err) {
    next(err);
  }
}

// PUT /api/suppliers/:id
async function updateSupplier(req, res, next) {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });

    const { name, contactEmail, phone } = req.body;
    supplier.name = name;
    supplier.contactEmail = contactEmail;
    supplier.phone = phone;
    await supplier.save();

    res.json(supplier);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/suppliers/:id
async function deleteSupplier(req, res, next) {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });

    // Prevent deleting a supplier that still has products linked, so the
    // user doesn't accidentally end up with orphaned/confusing data.
    const linkedProducts = await Product.count({ where: { supplierId: supplier.id } });
    if (linkedProducts > 0) {
      return res.status(400).json({
        message: `Cannot delete: ${linkedProducts} product(s) still reference this supplier. Reassign or delete them first.`,
      });
    }

    await supplier.destroy();
    res.json({ message: "Supplier deleted" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
