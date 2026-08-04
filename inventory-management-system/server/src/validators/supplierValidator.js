const { body, validationResult } = require("express-validator");

const supplierValidationRules = [
  body("name").trim().notEmpty().withMessage("Supplier name is required"),
  body("contactEmail")
    .trim()
    .notEmpty().withMessage("Contact email is required")
    .bail()
    .isEmail().withMessage("Contact email must be a valid email address"),
  body("phone").optional({ checkFalsy: true }).trim(),
];

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

module.exports = { supplierValidationRules, validate };
