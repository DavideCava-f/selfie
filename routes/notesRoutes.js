import express from 'express';
import mongoose from "mongoose";
import { User, Event, Note } from "../schemas.js";
import { ObjectId } from 'mongodb';
const router = express.Router();

const uri = `mongodb+srv://nicola1travaglini:testtest@test.pe0yf.mongodb.net/selfie?retryWrites=true&w=majority&appName=Test"`;

router.post("/", async function(req, res) {
  try {
    await mongoose.connect(uri);
    // let tags = JSON.parse(req.body.tags)
    //console.log(JSON.stringify(tags[0]))
    var creationDate = new Date().toISOString()
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

router.delete("/", async function(req, res) {
  try {
    await mongoose.connect(uri);
    let idNote = req.body.id_Note;
    console.log(idNote)
    await Note.deleteOne({ _id: new ObjectId(idNote) })
    res.json({ mess: "ciao" });
  } finally {
    mongoose.connection.close();
  }
});

router.put("/", async function(req, res) {
  try {
    await mongoose.connect(uri);
    let idNote = req.body.id_Note;
    let UpdateDate = new Date().toISOString()
    console.log(idNote)
    await Note.updateOne({ _id: new ObjectId(idNote) }, { $set: { Title: req.body.title_note, lastUpDate: UpdateDate, Text: req.body.content_note, Tags: JSON.parse(req.body.tags_note) } })
    res.json({ mess: "ciao" });
  } finally {
    mongoose.connection.close();
  }
});

router.get("/", async function(req, res) {
  try {
    console.log("arrivata ReadNotes");
    await mongoose.connect(uri);
    const FoundNotes = await Note.find({});
    res.json(FoundNotes);
  } finally {
    mongoose.connection.close();
  }
});


export default router;