import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function register(req, res) {
  const { firstName, lastName, username, password } = req.body;

  if (!firstName || !lastName || !username || !password) {
    return res.status(400).json({
      error: "First name, last name, username, and password are required",
    });
  }

  const existing = await User.findOne({ where: { username } });
  if (existing) {
    return res.status(409).json({ error: "Username already taken" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    firstName,
    lastName,
    username,
    passwordHash,
  });

  const fullName = `${user.firstName} ${user.lastName}`;

  const token = jwt.sign(
    { userId: user.id, fullName },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res
    .status(201)
    .json({ token, id: user.id, username: user.username, fullName });
}

export async function login(req, res) {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });
  if (!user) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const fullName = `${user.firstName} ${user.lastName}`;

  const token = jwt.sign(
    { userId: user.id, fullName },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.json({ token, id: user.id, username: user.username, fullName });
}

export async function logout(req, res) {
  res.json({ message: "Logged Out Successfully" });
}
