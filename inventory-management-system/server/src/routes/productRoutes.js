const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { requireAuth } = require("../middleware/auth");
const upload = require("../middleware/upload");
const { productValidationRules, validate } = require("../validators/productValidator");

// The brief requires that an unauthenticated user cannot see OR change
// any inventory data, so every product route sits behind requireAuth.
router.use(requireAuth);

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", upload.single("image"), productValidationRules, validate, createProduct);
router.put("/:id", upload.single("image"), productValidationRules, validate, updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
