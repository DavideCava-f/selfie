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

router.get("/nearEvents", verifyToken, async function(req, res) {
  try{
    const today = req.query.today;
    console.log(req.query);
    console.log(today);

    var nearEvents = await Event.find({ userId: req.userId, "dates.begin": { $gte: today } });
    console.log("dopo la find");

    for (let i = 0; i < nearEvents.length; i++) {
      nearEvents[i].dates = nearEvents[i].dates.filter((date)=>{
        return (Temporal.PlainDateTime.compare(date.begin.toISOString().slice(0,-1),today) >=0);
      });
    }
    console.log(nearEvents);
    /*
    nearEvents.sort((a,b)=>{ //a e b sono 2 eventi
      console.log(a.dates[0].begin.toISOString().slice(0,-1));
      console.log(b.dates[0].begin.toISOString().slice(0,-1));

      return Temporal.plainDateTime.compare(a.dates[0].begin, b.dates[0].begin);
    });
    */
      
    //console.log(nearEvents[0].dates[0].begin.toISOString().slice(0,-1));
    res.status(200).json(nearEvents);
  }finally{

  }
});

router.get("/eventOfMonth", verifyToken, async function(req, res) {
  try {
    const firstday = req.query.firstday;
    let lastDate= Temporal.PlainDate.from(firstday);
    lastDate = (lastDate.with({day: Temporal.PlainDate.from(firstday).daysInMonth})).toString();

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
  } catch(err) {
    res.status(500).json({ error: err.message });
  } finally {
  }
});

export default router;
