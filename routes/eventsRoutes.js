import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Event } from "../schemas.js";
import verifyToken from "./middleware.js";
const router = express.Router();

dotenv.config();
const uri = process.env.MONGODB_DEV;

router.post("/", verifyToken, async function(req, res) {
  try {
    await mongoose.connect(uri);
    await Event.create(req.body);
  } finally {
    res.json({ mess: "GOOD" });
    mongoose.connection.close();
  }
});

router.get("/", verifyToken, async function(req, res) {
  try {
    await mongoose.connect(uri);
    const events = await Event.find({});
    res.json(events);
  } finally {
    mongoose.connection.close();
  }
});

export default router;
