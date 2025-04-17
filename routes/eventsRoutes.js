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

router.delete("/OneEvent", verifyToken, async function(req, res) {
  try {
    console.log("inside delete!!!");
    //  console.log(req.body.idEvent)
    //console.log(req.body.idOp)
    const activeDate = req.body.date;
    console.log(activeDate)
    // console.log(req.body.idOp)
    if (req.body.idOp == 0) {

      const ev = await Event.findOne({ _id: req.body.idEvent })
      console.log(ev);

      if (ev.dates.length == 1) {
        const v = await Event.deleteOne({ _id: req.body.idEvent })
        console.log(v)
      } else {

        console.log("update One!");
        let startOfDay = Temporal.PlainDateTime.from(activeDate);
        let endOfDay = startOfDay.add({ hours: 23, minutes: 59, seconds: 59 });
        startOfDay = startOfDay.toString();
        endOfDay = endOfDay.toString();
        await Event.updateOne({ _id: req.body.idEvent }, {
          $pull: {
            dates: {
              $or: [
                { begin: { $gte: startOfDay, $lte: endOfDay } },
                { end: { $gte: startOfDay, $lte: endOfDay } }
              ]
            }
          }
        });
      }
    } else {
      await Event.deleteOne({ _id: req.body.idEvent })
    }

    //  res.status(200).json(event);
    //res.status(200).send("aa")
    res.status(200).json({ "a": "a" })
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  } finally {
  }


});


router.put("/OneEvent", verifyToken, async function(req, res) {
  console.log("inside put!!!");
  try {
    if (req.body.idOp == 0) {
      const event = await Event.updateOne({ _id: req.body.id }, {
        $set: {
          "title": req.body.title,
          "details.text": req.body.text,
          "details.link": req.body.link
        }

      });
    } else {
      const dates = [{ begin: new Date(req.body.beginDate), end: new Date(req.body.endDate) }]
      const details = { text: req.body.text, link: req.body.link }
      console.log(dates)
      const activeDate = req.body.date
      let startOfDay = Temporal.PlainDateTime.from(activeDate);
      let endOfDay = startOfDay.add({ hours: 23, minutes: 59, seconds: 59 });
      startOfDay = startOfDay.toString();
      endOfDay = endOfDay.toString();
      await Event.updateOne({ _id: req.body.id }, {
        $pull: {
          dates: {
            $or: [
              { begin: { $gte: startOfDay, $lte: endOfDay } },
              { end: { $gte: startOfDay, $lte: endOfDay } }
            ]
          }
        }
      })
      console.log("putamadre")
      const a = await Event.create({
        userId: req.userId,
        dates: dates,
        title: req.body.title,
        details: details
      });
    }
    res.json({ mess: "ciao" });
    //res.status(200).send("aa")
  } catch (err) {
    console.log(err);
  } finally {
  }
});

router.get("/nearEvents", verifyToken, async function(req, res) {
  try {
    const today = req.query.today;
    const isNotification = req.query.isNotification;
    const advance = Temporal.PlainDateTime.from(req.query.today).add({ days: 7 });

    console.log("today: " + today + "  " + typeof today);
    console.log("advance: " + advance.toString() + "  " + typeof advance);

    if (!isNotification) {
      var nearEvents = await Event.find({ userId: req.userId, "dates.begin": { $gte: today.toString() + "Z" } });
    }
    else {
      var nearEvents = await Event.find({ userId: req.userId, "dates.begin": { $gte: today.toString() + "Z", $lte: advance.toString() + "Z" } });
    }

    console.log(nearEvents);
    for (let i = 0; i < nearEvents.length; i++) {
      nearEvents[i].dates = nearEvents[i].dates.filter((date) => {
        return (Temporal.PlainDateTime.compare(date.begin.toISOString().slice(0, -1), today) >= 0);
      }).sort((a, b) => {
        return Temporal.PlainDateTime.compare(a.begin.toISOString().slice(0, -1), b.begin.toISOString().slice(0, -1));
      });
    }
    console.log(nearEvents);
    nearEvents = nearEvents.sort((a, b) => {
      return Temporal.PlainDateTime.compare(a.dates[0].begin.toISOString().slice(0, -1), b.dates[0].begin.toISOString().slice(0, -1));
    });

    res.status(200).json(nearEvents);
  } finally {

  }
});

router.get("/ofday", verifyToken, async function(req, res) {
  try {
    let startDay = Temporal.PlainDateTime.from(req.query.day);
    let endDay = startDay.add({ hours: 23, minutes: 59, seconds: 59 });
    startDay = startDay.toString() + "Z";
    endDay = endDay.toString() + "Z";
    const eventsOfDay = await Event.find(
      {
        userId: req.userId,
        dates: {
          $elemMatch: {
            $or: [
              {
                begin: { $gte: startDay, $lte: endDay }
              },
              {
                end: { $gte: startDay, $lte: endDay }
              },
              {
                begin: { $lte: startDay },
                end: { $gte: endDay }
              }
            ]
          }
        }
      }
    );
    //console.log(eventsOfDay);
    res.status(200).json(eventsOfDay);
  } catch (error) {
    console.log(error);
    res.status(500).send();
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

    //console.log(eventsOfWeek);
    res.status(200).json(eventsOfWeek);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/eventOfMonth", verifyToken, async function(req, res) {
  try {
    const firstday = req.query.firstday;
    let lastDate = Temporal.PlainDate.from(firstday).with({ day: Temporal.PlainDate.from(firstday).daysInMonth }).toString();

    console.log(firstday.toString());
    console.log(lastDate.toString());
    const eventsOfMonth = await Event.aggregate([
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
      { $match: { day: { $gte: new Date(firstday).toISOString().split("T")[0], $lte: new Date(lastDate).toISOString().split("T")[0] } } },
      // 7. Group by day
      { $group: { _id: "$day", events: { $push: "$$ROOT" } } },
      { $sort: { _id: 1 } }
    ]);
    //console.log(eventsOfMonth);

    res.status(200).json(eventsOfMonth);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
  }
});

export default router;



//{ $gte: new Date(firstday).toISOString().split("T")[0], $lte: new Date(lastDate).toISOString().split("T")[0] }
