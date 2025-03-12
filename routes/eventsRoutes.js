import express from "express";
import dotenv from "dotenv";
import { Event, User } from "../schemas.js";
import verifyToken from "./middleware.js";
import { Temporal } from "@js-temporal/polyfill";
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
    
    //console.log(events[0].dates);
    const todayTime = Temporal.Now.plainDateTimeISO().toPlainTime();
    const todayDate = Temporal.Now.plainDateTimeISO().toPlainDate();
    const today = `${todayDate}T${todayTime}`; 
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

export default router;
