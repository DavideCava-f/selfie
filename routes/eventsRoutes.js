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
      // 1. Filter events by the current user.
      { $match: { userId: new mongoose.Types.ObjectId(req.userId) } },

      // 2. Unwind the dates array.
      { $unwind: "$dates" },

      // 3. Sort by the original begin date.
      { $sort: { "dates.begin": 1 } },

      // 4. Calculate the number of days spanned by the event (inclusive).
      {
        $addFields: {
          totalDays: {
            $add: [
              {
                $dateDiff: {
                  startDate: "$dates.begin",
                  endDate: "$dates.end",
                  unit: "day"
                }
              },
              1
            ]
          }
        }
      },

      // 5. Generate an array of day offsets (0, 1, ..., totalDays - 1).
      {
        $addFields: {
          dayOffsets: { $range: [0, "$totalDays"] }
        }
      },

      // 6. Unwind the dayOffsets so that each event is repeated per day offset.
      { $unwind: "$dayOffsets" },

      // 7. Calculate new begin and end for each split day.
      {
        $addFields: {
          // newBegin: For the first segment, keep the original begin.
          // Otherwise, add the day offset (in days) to the truncated (midnight) of the original begin.
          newBegin: {
            $cond: [
              { $eq: ["$dayOffsets", 0] },
              "$dates.begin",
              {
                $dateAdd: {
                  startDate: { $dateTrunc: { date: "$dates.begin", unit: "day" } },
                  unit: "day",
                  amount: "$dayOffsets"
                }
              }
            ]
          },
          // newEnd:
          // For non-final segments, use the midnight of the next day.
          // For the final segment (dayOffsets == totalDays - 1):
          //   If the original event end is exactly at midnight (all-day event),
          //   set newEnd to the end of the day (midnight plus 23:59, i.e. 1439 minutes).
          //   Otherwise, use the original event end.
          newEnd: {
            $cond: [
              { $eq: ["$dayOffsets", { $subtract: ["$totalDays", 1] }] },
              {
                // If it's the last segment of the event
                $cond: [
                  {
                    // Check if the original end time is exactly at midnight
                    $eq: [
                      {
                        $dateDiff: {
                          startDate: { $dateTrunc: { date: "$dates.end", unit: "day" } },
                          endDate: "$dates.end",
                          unit: "minute"
                        }
                      },
                      0
                    ]
                  },
                  // If the event originally ended at midnight, set it to 23:59
                  {
                    $dateAdd: {
                      startDate: { $dateTrunc: { date: "$dates.begin", unit: "day" } },
                      unit: "minute",
                      amount: 1439 // 23:59
                    }
                  },
                  "$dates.end"
                ]
              },
              // For all other segments, set the end to 23:59 of the same day
              {
                $dateAdd: {
                  startDate: { $dateTrunc: { date: "$dates.begin", unit: "day" } },
                  unit: "minute",
                  amount: 1439
                }
              }
            ]
          }
        }
      },

      // 8. Overwrite the original dates.begin and dates.end with the new computed values.
      {
        $addFields: {
          "dates.begin": "$newBegin",
          "dates.end": "$newEnd"
        }
      },

      // 9. Add a normalized "day" field (using the new dates.begin) for grouping.
      {
        $addFields: {
          day: { $dateToString: { format: "%Y-%m-%d", date: "$dates.begin" } }
        }
      },

      // 10. Remove temporary fields.
      {
        $project: {
          totalDays: 0,
          dayOffsets: 0,
          newBegin: 0,
          newEnd: 0
        }
      },

      // 11. Filter events that fall within the current week (using the computed day field).
      {
        $match: {
          day: {
            $gte: monday,
            $lte: sunday
          }
        }
      },

      // 12. Group events by the normalized "day" field.
      {
        $group: {
          _id: "$day",
          events: { $push: "$$ROOT" }
        }
      },

      // 13. Optionally, sort groups by day.
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
