import express from "express";
import mongoose from "mongoose";
import { Event } from "../schemas.js";
const router = express.Router();

const uri = `mongodb+srv://nicola1travaglini:testtest@test.pe0yf.mongodb.net/selfie?retryWrites=true&w=majority&appName=Test"`;

router.post("/", async function(req, res) {
  try {
    await mongoose.connect(uri);
    await Event.create(req.body);
  } finally {
    res.json({ mess: "GOOD" });
    mongoose.connection.close();
  }
});

router.get("/", async function(req, res) {
  try {
    await mongoose.connect(uri);
    const events = await Event.find({});
    res.json(events);
  } finally {
    mongoose.connection.close();
  }
});

export default router;
