import express from "express";
import { Note } from "../schemas.js";
import dotenv from "dotenv";
import verifyToken from "./middleware.js";
const router = express.Router();

dotenv.config();
const uri = process.env.MONGODB_DEV;

router.post("/", verifyToken, async function(req, res) {
  try {
    var creationDate = new Date().toISOString();
    await Note.create({
      userId: req.userId,
      creationDate: creationDate,
      lastUpDate: creationDate,
      Title: req.body.title,
      Text: req.body.content, //Campi singoli va bene stringa
      Tags: JSON.parse(req.body.tags), //Array di oggetti vuole l'oggetto
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
    let UpdateDate = new Date().toISOString();
    await Note.updateOne(
      { _id: idNote },
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
  try{
    const lastnotes = await Note.find({userId: req.userId}).sort({lastUpDate: -1}).limit(1);
    const lastnote= lastnotes[0];
    res.json(lastnote);
  } 
  catch(err){
    console.log(err);
  }finally{

  }
});

export default router;
