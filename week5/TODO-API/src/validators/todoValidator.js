import { body, param } from "express-validator";

export const createTodoValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string"),

  body("deadline")
    .notEmpty()
    .withMessage("Deadline is required")
    .isISO8601()
    .withMessage("Deadline must be a valid date (YYYY-MM-DD)"),

  body("isUrgent")
    .isBoolean()
    .withMessage("isUrgent is required and must be true or false"),
];

export const updateTodoValidator = [
  param("id").isInt().withMessage("id must be an integer").toInt(),

  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title must be a non-empty string"),

  body("deadline")
    .optional()
    .isISO8601()
    .withMessage("Deadline must be a valid date (YYYY-MM-DD)"),

  body("isUrgent")
    .optional()
    .isBoolean()
    .withMessage("isUrgent must be true or false"),
];

export const idParamValidator = [
  param("id").isInt().withMessage("id must be an integer").toInt(),
];
