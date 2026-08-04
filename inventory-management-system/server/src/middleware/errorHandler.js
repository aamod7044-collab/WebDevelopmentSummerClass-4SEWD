// Catches anything thrown/passed to next(err) anywhere in the app,
// so the frontend always gets a clean JSON error instead of an HTML crash page.
function errorHandler(err, req, res, next) {
  console.error(err);

  // Multer file-too-large / bad file type errors
  if (err.name === "MulterError" || err.message?.includes("Only image files")) {
    return res.status(400).json({ message: err.message });
  }

  // Sequelize validation errors (e.g. negative price, missing required field)
  if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
    const messages = err.errors.map((e) => e.message);
    return res.status(400).json({ message: messages.join(", "), errors: messages });
  }

  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Something went wrong on the server." });
}

module.exports = errorHandler;
