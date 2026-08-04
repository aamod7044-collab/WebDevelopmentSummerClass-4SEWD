require("dotenv").config();
const bcrypt = require("bcryptjs");
const { sequelize, User, Supplier, Product } = require("./models");

async function seed() {
  await sequelize.sync({ force: false });

  // --- Admin user ---
  const username = process.env.ADMIN_USERNAME || "admin";
  const plainPassword = process.env.ADMIN_PASSWORD || "Admin123!";

  const existingUser = await User.findOne({ where: { username } });
  if (!existingUser) {
    const passwordHash = await bcrypt.hash(plainPassword, 10);
    await User.create({ username, passwordHash, role: "admin" });
    console.log(`Created admin user "${username}" (password from .env)`);
  } else {
    console.log(`Admin user "${username}" already exists, skipping.`);
  }

  // --- Sample suppliers & products, only if none exist yet ---
  const supplierCount = await Supplier.count();
  if (supplierCount === 0) {
    const s1 = await Supplier.create({
      name: "Acme Wholesale",
      contactEmail: "sales@acmewholesale.example",
      phone: "01234 567890",
    });
    const s2 = await Supplier.create({
      name: "Global Parts Co.",
      contactEmail: "contact@globalparts.example",
      phone: "01987 654321",
    });

    await Product.bulkCreate([
      { name: "Steel Bolt (M8)", description: "Standard M8 steel bolt, 40mm", price: 0.15, quantity: 500, supplierId: s1.id },
      { name: "Cordless Drill", description: "18V cordless drill with battery", price: 89.99, quantity: 12, supplierId: s2.id },
      { name: "Safety Goggles", description: "ANSI-rated clear safety goggles", price: 4.5, quantity: 3, supplierId: s1.id },
      { name: "Copper Wire (10m)", description: "10-metre reel of 1.5mm copper wire", price: 12.25, quantity: 2, supplierId: s2.id },
    ]);
    console.log("Created sample suppliers and products.");
  } else {
    console.log("Suppliers already exist, skipping sample data.");
  }

  console.log("Seeding complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
