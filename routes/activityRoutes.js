import express from "express";
import dotenv from "dotenv";
import { Event, User } from "../schemas.js";
import verifyToken from "./middleware.js";
import { Temporal } from "@js-temporal/polyfill";
import mongoose from "mongoose";
const router = express.Router();

dotenv.config();

router.post("/", verifyToken, async function(req, res) {

});

router.get("/", verifyToken, async function(req, res) {

    try{
    const Acts = await Activity.find({ userId: req.userId });
    res.json(Acts);
    }catch(err){
        res.status(500).send()

    }
});
router.delete("/", verifyToken, async function(req, res) {

    try{
    await Activity.delete({ _id: req.body.id_Act });

    }catch(err){
        res.status(500).send()

    }



});

router.put("/", verifyToken, async function(req, res) {

    const comple = false
    if(req.body.completion){
        comple = true
    }

    try{
    const Acts = await Activity.updateOne({ _id: req.body.id_Act },{$set:{

        completed: comple
    }
    });
        res.status(200).send()
    }catch(err){
        res.status(500).send()

    }
});
export default router;