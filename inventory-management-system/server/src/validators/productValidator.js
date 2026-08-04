const { body, validationResult } = require("express-validator");

// Server-side is the SOURCE OF TRUTH - even if someone bypasses the
// React form and calls the API directly (e.g. with Postman), these
// rules still apply.
const productValidationRules = [
  body("name").trim().notEmpty().withMessage("Product name is required"),
  body("price")
    .notEmpty().withMessage("Price is required")
    .bail()
    .isFloat({ min: 0 }).withMessage("Price must be a number that is not negative"),
  body("quantity")
    .notEmpty().withMessage("Quantity is required")
    .bail()
    .isInt({ min: 0 }).withMessage("Quantity must be a whole number that is not negative"),
  body("supplierId")
    .optional({ checkFalsy: true })
    .isInt().withMessage("Supplier must be valid"),
];

// Run after the rules above; sends a 400 with clear messages if anything failed.
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg,
      errors: errors.array().map((e) => e.msg),
    });
  }
  next();
}

module.exports = { productValidationRules, validate };
