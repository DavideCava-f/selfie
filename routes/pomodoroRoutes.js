import express from "express";
import dotenv from "dotenv";
import { Pomodoro } from "../schemas.js";
import verifyToken from "./middleware.js";
const router = express.Router();

dotenv.config();
const uri = process.env.MONGODB_DEV;

router.post("/", verifyToken, async function(req, res) {
  try {
    await Pomodoro.create({
      userId: req.userId,
      beginDate: req.body.beginDate,
      cycles: req.body.cycles,
      studyMins: req.body.studyMins,
      pauseMins: req.body.pauseMins,
      completedCycles: req.body.completedCycles, // Default to 0 if not provided
      completedDate: req.body.completedDate // Default to null if not provided,
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
    const pomodoros = await Pomodoro.find({ userId: req.userId, beginDate:{$ne: null} });
    res.status(200).json(pomodoros);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});


router.delete("/", verifyToken, async function(req, res) {
  try {
    const id = req.query.id;
    await Pomodoro.deleteOne({ _id: id });
    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

router.put("/", verifyToken, async function(req, res) {
  try {
    const id = req.query.id;
    await Pomodoro.updateOne({ _id: id }, {
      $inc: {
        completedCycles: 1
      },
      $set:{
        completedDate: req.query.completedDate
      }
    });
    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

router.put("/sweep", verifyToken, async function(req, res) {
  try {
    const ids = req.body.ids;
    await Pomodoro.updateMany(
      { _id: { $in: ids } },
      [{ $set: { completedCycles: "$cycles" }}]
    );
    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

router.put("/reset", verifyToken, async function(req, res) {
  try {
    const id = req.query.id;
    await Pomodoro.updateOne(
      { _id: id }, {
      $set: {
        completedCycles: 0
      }}
    );
    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

router.get("/last", verifyToken, async function(req, res) {
  try {
    const lastPomodoro = await Pomodoro.find({ userId: req.userId }).sort({completedDate: -1 }).limit(1);
    if (lastPomodoro.length === 0) {
      res.json(null);
    }else{
      res.status(200).json(lastPomodoro[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

export default router;
