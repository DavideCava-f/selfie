import express from "express";
import dotenv from "dotenv";
import { Event, User, Activity } from "../schemas.js";
import verifyToken from "./middleware.js";
import { Temporal } from "@js-temporal/polyfill";
import mongoose from "mongoose";
const router = express.Router();

dotenv.config();

router.post("/", verifyToken, async function(req, res) {
    console.log(req.body.deadlineDate)
    try {
        await Activity.create({
            userId: req.userId,
            dates: [
                {
                    creation: new Date().toISOString(),
                    deadline: req.body.deadlineDate
                }
            ],
            title: req.body.title,
            text: req.body.text,
            completed: false,
        });
    } catch (err) {
        console.log(err);
    }
});

router.get("/", verifyToken, async function(req, res) {
    try {
        const Acts = await Activity.find({ userId: req.userId });
        res.json(Acts);
    } catch (err) {
        res.status(500).send()

    }
});
router.delete("/", verifyToken, async function(req, res) {
    try {
        await Activity.deleteOne({ _id: req.body.id_Act });
        res.status(200).send()
    } catch (err) {
        res.status(500).send()
    }
});

router.put("/", verifyToken, async function(req, res) {
    var comple = false
    if (req.body.completion) {
        comple = true
    }
    try {
        const Acts = await Activity.updateOne({ _id: req.body.id_Act }, {
            $set: {

                completed: comple
            }
        });
        res.status(200).send()
    } catch (err) {
        res.status(500).send()
    }
});


router.get("/ofday", verifyToken, async function(req, res) {
    try {
        let startDay = Temporal.PlainDateTime.from(req.query.day);
        let endDay = startDay.add({ hours: 23, minutes: 59, seconds: 59 });
        startDay = startDay.toString() + "Z";
        endDay = endDay.toString() + "Z";
        const activities = await Activity.find(
            {
                userId: req.userId,
                dates: {
                    $elemMatch: {
                        $or: [
                            { creation: { $gte: startDay, $lte: endDay } },
                            { deadline: { $gte: startDay, $lte: endDay } }
                        ]
                    }
                }
            }
        );
        res.status(200).json(activities);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
});

export default router;
