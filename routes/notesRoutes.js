import express from "express";
import { Note } from "../schemas.js";
import dotenv from "dotenv";
import verifyToken from "./middleware.js";
const router = express.Router();

dotenv.config();
const uri = process.env.MONGODB_DEV;

router.post("/", verifyToken, async function(req, res) {
  try {
    await Note.create({
      userId: req.userId,
      creationDate: req.body.creationDate,
      lastUpDate: req.body.creationDate,
      Title: req.body.title,
      Text: req.body.content, //Campi singoli va bene stringa
      Tags: JSON.parse(req.body.tags), //Array di oggetti vuole l'oggetto
      markdown: req.body.markdown
    });
  } finally {
    res.json({ note: req.body });
  }
});

router.delete("/", verifyToken, async function(req, res) {
  try {
    let idNote = req.body.id_Note;
    await Note.deleteOne({ _id: idNote });
    res.json({ mess: "ciao" });
  } finally {
  }
});

router.put("/", verifyToken, async function(req, res) {
  try {
    let idNote = req.body.id_Note;
    await Note.updateOne(
      { _id: idNote },
      {
        $set: {
          Title: req.body.title_note,
          lastUpDate: req.body.lastUpdate,
          Text: req.body.content_note,
          Tags: JSON.parse(req.body.tags_note),
          markdown: req.body.markdown_note
        },
      },
    );
    res.json({ mess: "ciao" });
  } finally {
  }
});

router.get("/", verifyToken, async function(req, res) {
  try {
    const FoundNotes = await Note.find({ userId: req.userId });
    res.json(FoundNotes);
  } finally {
  }
});

router.get("/last", verifyToken, async function(req, res) {
  try {
    const lastnotes = await Note.find({ userId: req.userId }).sort({ lastUpDate: -1 }).limit(1);
    const lastnote = lastnotes[0];
    if (lastnote === undefined)
      res.send(404)
    else
      res.json(lastnote);
  }
  catch (err) {
  } finally {
  }
});

export default router;
