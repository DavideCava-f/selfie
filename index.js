import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { User, Event, Note } from "./schemas.js";
import { ObjectId } from 'mongodb';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
global.rootDir = __dirname;

let app = express();
app.use(express.static(path.join(global.rootDir, "dist")));
app.use(cors());
app.use(express.json());

// MongoDB & Mongoose
const dbName = "selfie232465";
const mongoCredentials = {
  user: "site232465",
  pwd: "uP9ohT3a",
  site: "mongo_site232465",
};
// const uri = `mongodb://${mongoCredentials.user}:${mongoCredentials.pwd}@${mongoCredentials.site}/${dbName}?retryWrites=true&w=majority&authSource=admin`;
// Atlas dev database
const uri = `mongodb+srv://nicola1travaglini:testtest@test.pe0yf.mongodb.net/selfie?retryWrites=true&w=majority&appName=Test"`;

// Functions

// Entry points
app.post("/CreateNote", async function (req, res) {
  console.log("ci sono nella create");
  try {
    await mongoose.connect(uri);
    // let tags = JSON.parse(req.body.tags)
    //console.log(JSON.stringify(tags[0]))
    const notes = await Note.create({
      userEmail: "fk@mail.com",
      creationDate: "",
      lastUpDate: "",
      Title: req.body.title,
      Text: req.body.content, //Campi singoli va bene stringa
      Tags: JSON.parse(req.body.tags), //Array di oggetti vuole l'oggetto
    });
  } finally {
    res.json({ mess: "GOOD" });
    mongoose.connection.close();
  }
});

app.delete("/DeleteNote", async function (req, res) {
  try {
    await mongoose.connect(uri);
    let idNote = req.body.id_Note;
    console.log(idNote)
    await Note.deleteOne({_id: new ObjectId(idNote)})
    res.json({mess:"ciao"});
  } finally {
    mongoose.connection.close();
  }
});

app.get("/ReadNotes", async function (req, res) {
  try {
    await mongoose.connect(uri);
      const FoundNotes = await Note.find({})
    res.json(FoundNotes);
  } finally {
    mongoose.connection.close();
  }
});

app.get("/example", async function (req, res) {
  try {
    await mongoose.connect(uri);
  } finally {
    mongoose.connection.close();
  }
});

app.get("/dbdebug", async function (req, res) {
  try {
    await mongoose.connect(uri);
    const test = await Note.find({});
    res.json(test);
  } finally {
    mongoose.connection.close();
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(global.rootDir, "dist", "index.html"));
});

app.listen(5173, function () {
  global.startDate = new Date();
  console.log(
    `App listening on port 5173 started ${global.startDate.toLocaleString()}`,
  );
});
