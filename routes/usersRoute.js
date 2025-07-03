import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { User, Event, Pomodoro, Note, Activity } from "../schemas.js";
import verifyToken from "./middleware.js";
const router = express.Router();

dotenv.config();
const uri = process.env.MONGODB_DEV;

router.post("/register", async function(req, res) {
  try {
    const user = await User.create(req.body);
    const token = await jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "Strict" }).status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

router.get("/login", async function(req, res) {
  try {
    const { email, password } = req.query;
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
    res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "Lax" }).status(200).send();
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error });
  }
});

router.get("/logout", async function(req, res) {
  res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "Strict" });
  res.status(200).send();
});

router.delete("/", verifyToken, async function(req, res) {
  try {
    const userId = req.userId;
    await Event.deleteMany({ userId: userId });
    await Pomodoro.deleteMany({ userId: userId });
    await Note.deleteMany({ userId: userId });
    await Activity.deleteMany({ userId: userId });
    await User.deleteMany({ _id: userId });
    res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "Strict" });
    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

router.get("/isnew", async function(req, res) {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(401).json({ error: "User already exists" });
    }
    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

router.get("/info", verifyToken, async function(req, res) {
  try {
    const user = await User.findOne({ _id: req.userId });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
})

export default router;
