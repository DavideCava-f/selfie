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

    const Acts = await Activity.find({ userId: req.userId });
    res.json(Acts);
});
router.delete("/", verifyToken, async function(req, res) {

    await Activity.delete({ _id: req.body.id_Act });




});