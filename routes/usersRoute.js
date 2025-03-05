import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { User } from "../schemas.js";
import verifyToken from "./middleware.js";
const router = express.Router();

dotenv.config();
const uri = process.env.MONGODB_DEV;

router.post("/register", async function(req, res) {
  try {
    await mongoose.connect(uri);
    const user = await User.create(req.body);
    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "Strict" }).status(200).send();
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  } finally {
    mongoose.connection.close();
  }
});

router.get("/login", async function(req, res) {
  try {
    const { email, password } = req.query;
    await mongoose.connect(uri);
    const user = await User.findOne({ email: email });
    if (!user) {
      mongoose.connection.close();
      return res.status(401).json({ error: "Authentication failed" });
    }
    if (password !== user.password) {
      mongoose.connection.close();
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

router.get("/logout", async function(req, res) {
  res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "Strict" });
  res.status(200).send();
});

router.get("/isnew", async function(req, res) {
  try {
    const { email } = req.query;
    await mongoose.connect(uri);
    const user = await User.findOne({ email: email });
    if (user) {
      mongoose.connection.close();
      return res.status(401).json({ error: "User already exists" });
    }
    res.status(200).send();
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  } finally {
    mongoose.connection.close();
  }
});

router.get("/info", verifyToken, async function(req, res) {
  try {
    await mongoose.connect(uri);
    const user = await User.findOne({ _id: req.userId });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  } finally {
    mongoose.connection.close();
  }

})

export default router;
