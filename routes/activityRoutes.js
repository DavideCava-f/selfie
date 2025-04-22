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
        notification: {
            isLate: false,
            oneDayLate: false,
            oneWeekLate: false
        }
        });
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
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

router.put("/update", verifyToken, async function(req, res) {
    console.log(req.body.deadlineDate)
    try {
        const Acts = await Activity.updateOne({ _id: req.body.id }, {
            $set: {

               "notification.isLate" : req.body.isLateModified, 
               "notification.oneDayLate" : req.body.oneDayModified, 
               "notification.oneWeekLate" : req.body.oneWeekModified, 
            }
        })
        res.status(200).send()
    } catch (err) {
        res.status(500).send()
    }
});

router.put("/noted", verifyToken, async function(req, res) {
    try {
        const Acts = await Activity.updateOne({ _id: req.body.id_Act }, {
            $set: {

                "title": req.body.title,
                "text": req.body.text,
                "dates.0.deadline": req.body.deadlineDate
            }
        })
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
                completed: false,
                "dates.deadline": { $lte: endDay }
            }
        );
        res.status(200).json(activities);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
});

router.get("/ofweek", verifyToken, async function(req, res) {
    try {
        const monday = Temporal.PlainDate.from(req.query.monday).toString();
        const sunday = Temporal.PlainDate.from(monday).add({ days: 6 }).toString();

        const activities = await Activity.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(req.userId), completed: false } },
            { $unwind: "$dates" },
            { $sort: { "dates.deadline": 1 } },
            { $addFields: { day: { $dateToString: { format: "%Y-%m-%d", date: "$dates.deadline" } } } },
            { $match: { day: { $gte: monday, $lte: sunday } } },
            { $group: { _id: "$day", activities: { $push: "$$ROOT" } } },
            { $sort: { _id: 1 } }
        ]);
        console.log(activities);
        res.status(200).json(activities);
    } catch (error) {
        console.log(error);
        res.status(200).json({ error: error })
    }
});

router.get("/ofmonth", verifyToken, async function(req, res) {
    try {
        const firstday = req.query.firstday;
        let lastDate = Temporal.PlainDate.from(firstday).with({ day: Temporal.PlainDate.from(firstday).daysInMonth }).toString();

        const activities = await Activity.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(req.userId), completed: false } },
            { $unwind: "$dates" },
            { $sort: { "dates.deadline": 1 } },
            { $addFields: { day: { $dateToString: { format: "%Y-%m-%d", date: "$dates.deadline" } } } },
            { $match: { day: { $gte: new Date(firstday).toISOString().split("T")[0], $lte: new Date(lastDate).toISOString().split("T")[0] } } },
            { $group: { _id: "$day", activities: { $push: "$$ROOT" } } },
            { $sort: { _id: 1 } }
        ]);
        console.log(activities);
        res.status(200).json(activities);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    } finally {
    }
});


export default router;
