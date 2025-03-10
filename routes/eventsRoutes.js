import express from "express";
import dotenv from "dotenv";
import { Event, User } from "../schemas.js";
import verifyToken from "./middleware.js";
const router = express.Router();

dotenv.config();
const uri = process.env.MONGODB_DEV;

router.post("/", verifyToken, async function(req, res) {
  try {
    await Event.create({
      userId: req.userId,
      dates: req.body.dates,
      title: req.body.title,
      details: req.body.details
    });
  } catch {
    res.status(500).send();
  } finally {
    res.status(200).send();
  }
});

router.get("/", verifyToken, async function(req, res) {
  try {
    const events = await Event.find({ userId: req.userId });
    res.status(200).json(events);
  } catch {
    res.status(500).send();
  } finally {
  }
});

export default router;
