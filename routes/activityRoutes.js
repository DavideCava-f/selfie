import express from "express";
import dotenv from "dotenv";
import { Event, User, Activity } from "../schemas.js";
import verifyToken from "./middleware.js";
import { Temporal } from "@js-temporal/polyfill";
import mongoose from "mongoose";
const router = express.Router();

dotenv.config();

router.post("/", verifyToken, async function(req, res) {
    try{
        await Activity.create({
            userId: req.userId,
            dates: [
                {
                    creation: new Date().toISOString(),
                    deadline: req.body.deadline
                }
            ],
            title: req.body.title,
            text: req.body.text,
            completed: false,
        });
    }catch(err){
        console.log(err);
    }
});

router.get("/", verifyToken, async function(req, res) {

});