import express from "express";
import dotenv from "dotenv";
import { Event, User } from "../schemas.js";
import verifyToken from "./middleware.js";
import { Temporal } from "@js-temporal/polyfill";
import mongoose from "mongoose";
const router = express.Router();

dotenv.config();

router.post("/", verifyToken, async function(req, res) {
  try {
    console.log("Stampa date:");
    console.log(req.body.dates);
    await Event.create({
      userId: req.userId,
      dates: req.body.dates,
      title: req.body.title,
      details: req.body.details
    });
  } catch (error) {
    res.status(500).send(error);
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

router.get("/OneEvent", verifyToken, async function(req, res) {
  try {
    const event = await Event.findOne({ _id: req.query.id });
    res.status(200).json(event);
    //res.status(200).send("aa")
  } catch {
    res.status(500).send();
  } finally {
  }
});

router.put("/OneEvent", verifyToken, async function(req, res) {
  try {
    const event = await Event.updateOne({ _id: req.body.id }, {
      $set: {
        "title": req.body.title,
        "details.text": req.body.text,
        "details.link": req.body.link
      }

    });
    res.json({ mess: "ciao" });
    //res.status(200).send("aa")
  } catch {
    res.status(500).send();
  } finally {
  }
});
router.get("/nearEvents", verifyToken, async function(req, res) {
  try {
    const today = req.query.today;
    console.log(req.query);
    console.log("Oggi è" + today);

    var nearEvents = await Event.find({ userId: req.userId, "dates.begin": { $gte: today } });

    for (let i = 0; i < nearEvents.length; i++) {
      nearEvents[i].dates = nearEvents[i].dates.filter((date) => {
        return (Temporal.PlainDateTime.compare(date.begin.toISOString().slice(0, -1), today) >= 0);
      });
    }
    res.status(200).json(nearEvents);
  } finally {

  }
});

router.get("/ofweek", verifyToken, async function(req, res) {
  try {
    const monday = Temporal.PlainDate.from(req.query.monday).toString();
    const sunday = Temporal.PlainDate.from(monday).add({ days: 6 }).toString();

    const eventsOfWeek = await Event.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.userId) } },
      { $unwind: "$dates" },
      { $sort: { "dates.begin": 1 } },
      {
        $addFields: {
          totalDays: {
            $add: [
              { $dateDiff: { startDate: "$dates.begin", endDate: "$dates.end", unit: "day" } },
              1
            ]
          }
        }
      },
      { $addFields: { dayOffsets: { $range: [0, "$totalDays"] } } },
      { $unwind: "$dayOffsets" },
      // 1. Compute the "currentDay" (midnight of the split day)
      {
        $addFields: {
          currentDay: {
            $dateAdd: {
              startDate: { $dateTrunc: { date: "$dates.begin", unit: "day" } },
              unit: "day",
              amount: "$dayOffsets"
            }
          }
        }
      },
      // 2. Calculate newBegin and newEnd based on currentDay
      {
        $addFields: {
          newBegin: {
            $cond: [
              { $eq: ["$dayOffsets", 0] },
              "$dates.begin", // Keep original start time for the first day
              "$currentDay"   // For subsequent days, start at midnight
            ]
          },
          newEnd: {
            $cond: [
              // Check if this is the last segment
              { $eq: ["$dayOffsets", { $subtract: ["$totalDays", 1] }] },
              {
                // For the last segment, use original end time unless it's midnight
                $cond: [
                  {
                    $eq: [
                      "$dates.end",
                      { $dateTrunc: { date: "$dates.end", unit: "day" } }
                    ]
                  },
                  // If original end is midnight, set to 23:59 of currentDay
                  { $dateAdd: { startDate: "$currentDay", unit: "minute", amount: 1439 } },
                  "$dates.end" // Otherwise, use original end time
                ]
              },
              // For non-final segments, set end to 23:59 of currentDay
              { $dateAdd: { startDate: "$currentDay", unit: "minute", amount: 1439 } }
            ]
          }
        }
      },
      // 3. Overwrite dates.begin/end with computed values
      { $set: { "dates.begin": "$newBegin", "dates.end": "$newEnd" } },
      // 4. Add normalized day field for filtering/grouping
      { $addFields: { day: { $dateToString: { format: "%Y-%m-%d", date: "$dates.begin" } } } },
      // 5. Cleanup temporary fields
      { $project: { totalDays: 0, dayOffsets: 0, newBegin: 0, newEnd: 0, currentDay: 0 } },
      // 6. Filter by week
      { $match: { day: { $gte: monday, $lte: sunday } } },
      // 7. Group by day
      { $group: { _id: "$day", events: { $push: "$$ROOT" } } },
      { $sort: { _id: 1 } }
    ]);
    // const eventsOfWeek = await Event.aggregate([
    //   // 1. Filter events by the current user
    //   { $match: { userId: new mongoose.Types.ObjectId(req.userId) } },
    //
    //   // 2. Unwind the dates array to work with each date individually
    //   { $unwind: "$dates" },
    //
    //   {
    //     $addFields: {
    //       "dates.beginDateOnly": {
    //         $dateToString: { format: "%Y-%m-%d", date: "$dates.begin" }
    //       }
    //     }
    //   },
    //
    //   // 3. Filter out dates that are not in the current week
    //   { $match: { "dates.beginDateOnly": { $gte: new Date(monday).toISOString().split("T")[0], $lte: new Date(sunday).toISOString().split("T")[0] } } },
    //
    //   { $sort: { "dates.begin": 1 } },
    //
    //   // 4. Group the events by the date (dates.begin)
    //   {
    //     $group: {
    //       _id: "$dates.beginDateOnly",  // Group key is the date
    //       events: { $push: "$$ROOT" }  // Collect all event documents with that date
    //     }
    //   }
    // ]);

    console.log(eventsOfWeek);
    res.status(200).json(eventsOfWeek);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/eventOfMonth", verifyToken, async function(req, res) {
  try {
    const firstday = req.query.firstday;
    let lastDate = Temporal.PlainDate.from(firstday);
    lastDate = (lastDate.with({ day: Temporal.PlainDate.from(firstday).daysInMonth })).toString();

    console.log(firstday.toString());
    console.log(lastDate.toString());
    const eventsOfMonth = await Event.aggregate([
      // 1. Filter events by the current user
      { $match: { userId: new mongoose.Types.ObjectId(req.userId) } },

      // 2. Unwind the dates array to work with each date individually
      { $unwind: "$dates" },

      {
        $addFields: {
          "dates.beginDateOnly": {
            $dateToString: { format: "%Y-%m-%d", date: "$dates.begin" }
          }
        }
      },

      // 3. Filter out dates that are not in the current week
      { $match: { "dates.beginDateOnly": { $gte: new Date(firstday).toISOString().split("T")[0], $lte: new Date(lastDate).toISOString().split("T")[0] } } },

      // 4. Group the events by the date (dates.begin)
      {
        $group: {
          _id: "$dates.beginDateOnly",  // Group key is the date
          events: { $push: "$$ROOT" }  // Collect all event documents with that date
        }
      }
    ]);
    console.log(eventsOfMonth);

    res.status(200).json(eventsOfMonth);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
  }
});

export default router;
