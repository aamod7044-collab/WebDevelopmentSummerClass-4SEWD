const express = require("express");
const router = express.Router();
const {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/supplierController");
const { requireAuth } = require("../middleware/auth");
const { supplierValidationRules, validate } = require("../validators/supplierValidator");

router.use(requireAuth);

router.get("/", getAllSuppliers);
router.get("/:id", getSupplierById);
router.post("/", supplierValidationRules, validate, createSupplier);
router.put("/:id", supplierValidationRules, validate, updateSupplier);
router.delete("/:id", deleteSupplier);

module.exports = router;
