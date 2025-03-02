import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { User } from "../schemas.js";
const router = express.Router();

dotenv.config();
const uri = process.env.MONGODB_DEV;

router.post("/", async function(req, res) {
  try {
    await mongoose.connect(uri);
    await User.create(req.body);
  } finally {
    res.json({ mess: "GOOD" });
    mongoose.connection.close();
  }
});

router.get("/", async function(req, res) {
  try {
    const { email, password } = req.query;
    await mongoose.connect(uri);
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    if (password !== user.password) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "Strict" }).status(200).send();
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  } finally {
    mongoose.connection.close();
  }
});

export default router;
