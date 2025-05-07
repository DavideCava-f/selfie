import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Pomodoro } from "../schemas.js";
import verifyToken from "./middleware.js";
const router = express.Router();

dotenv.config();
const uri = process.env.MONGODB_DEV;

router.post("/", verifyToken, async function(req, res) {
  try {
    console.log(req.body);
    await Pomodoro.create({
      userId: req.userId,
      beginDate: req.body.beginDate,
      cycles: req.body.cycles,
      studyMins: req.body.studyMins,
      pauseMins: req.body.pauseMins,
    });
    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

/* NOTE: non creo una route per ogni tipo di get, come per gli eventi e le attivita'
 * di fatto i pomodoro saranno molti meno.
 * */
router.get("/", verifyToken, async function(req, res) {
  try {
    const pomodoros = await Pomodoro.find({ userId: req.userId });
    res.status(200).json(pomodoros);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});


export default router;
