const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded product images statically, e.g. GET /uploads/169999-photo.jpg
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// --- API routes (RESTful, resource-based) ---
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/suppliers", supplierRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// 404 for unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// Central error handler must be registered last
app.use(errorHandler);

module.exports = app;
