import express from "express";
import mongoose from "mongoose";
import { User } from "../schemas.js";
const router = express.Router();

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
    await mongoose.connect(uri);
    const users = await User.find({});
    res.json(users);
  } finally {
    mongoose.connection.close();
  }

});

export default router;
