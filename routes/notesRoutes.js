import express, { json } from "express";
import mongoose from "mongoose";
import { Note } from "../schemas.js";
import { ObjectId } from "mongodb";
import dotenv from "dotenv";
import verifyToken from "./middleware.js";
const router = express.Router();

dotenv.config();
const uri = process.env.MONGODB_DEV;

router.post("/", verifyToken, async function(req, res) {
  try {
    await mongoose.connect(uri);
    var creationDate = new Date().toISOString();
    const notes = await Note.create({
      userEmail: "fk@mail.com",
      creationDate: creationDate,
      lastUpDate: creationDate,
      Title: req.body.title,
      Text: req.body.content, //Campi singoli va bene stringa
      Tags: JSON.parse(req.body.tags), //Array di oggetti vuole l'oggetto
    });
  } finally {
    res.json({ note: req.body });
    mongoose.connection.close();
  }
});

router.delete("/", verifyToken, async function(req, res) {
  try {
    await mongoose.connect(uri);
    let idNote = req.body.id_Note;
    await Note.deleteOne({ _id: new ObjectId(idNote) });
    res.json({ mess: "ciao" });
  } finally {
    mongoose.connection.close();
  }
});

router.put("/", verifyToken, async function(req, res) {
  try {
    await mongoose.connect(uri);
    let idNote = req.body.id_Note;
    let UpdateDate = new Date().toISOString();
    await Note.updateOne(
      { _id: new ObjectId(idNote) },
      {
        $set: {
          Title: req.body.title_note,
          lastUpDate: UpdateDate,
          Text: req.body.content_note,
          Tags: JSON.parse(req.body.tags_note),
        },
      },
    );
    res.json({ mess: "ciao" });
  } finally {
    mongoose.connection.close();
  }
});

router.get("/", verifyToken, async function(req, res) {
  try {
    await mongoose.connect(uri);
    const FoundNotes = await Note.find({});
    res.json(FoundNotes);
  } finally {
    mongoose.connection.close();
  }
});

router.get("/last", verifyToken, async function(req, res) {
  try {
    await mongoose.connect(uri);
  
    const lastNote = await Note.find({}).sort({ lastUpDate: -1 }).limit(1);
    console.log(lastNote);
    res.json(lastNote) ;
  } finally {
    mongoose.connection.close();
  }
});

export default router;
