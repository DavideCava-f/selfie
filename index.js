import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import { User, Event, Note } from "./schemas.js";
import { ObjectId } from 'mongodb';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
global.rootDir = __dirname;

let app = express();
app.use(express.static(path.join(global.rootDir, "dist")));
app.use(cors());
app.use(express.json({ limit: "50mb" }));

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
app.post("/note", async function(req, res) {
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

app.delete("/note", async function(req, res) {
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

app.put("/note", async function(req, res) {
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

app.get("/note", async function(req, res) {
  try {
    console.log("arrivata ReadNotes");
    await mongoose.connect(uri);
    const FoundNotes = await Note.find({});
    res.json(FoundNotes);
  } finally {
    mongoose.connection.close();
  }
});

app.post("/events", async function(req, res) {
  try {
    console.log(req.body);
    await mongoose.connect(uri);
    await Event.create(req.body);
  } finally {
    res.json({ mess: "GOOD" });
    mongoose.connection.close();
  }
});

app.get("/users", async function(req, res) {
  try {
    await mongoose.connect(uri);
    const users = await User.find({});
    res.json(users);
  } finally {
    mongoose.connection.close();
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    const passwordMatch = password === user.password;
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    // FIXME: la chiave segreta del server dev'essere dinamica
    const token = jwt.sign({ userId: user._id }, 'CHIAVE CON LA Q', {
      expiresIn: '1h',
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
})

app.post("/events", async function(req, res) {
  try {
    console.log(req.body);
    await mongoose.connect(uri);
    await Event.create(req.body);
  } finally {
    res.json({ mess: "GOOD" });
    mongoose.connection.close();
  }
});
app.get("/events", async function(req, res) {
  try {
    console.log("arrivata");
    await mongoose.connect(uri);
    const events = await Event.find({});
    res.json(events);
  } finally {
    mongoose.connection.close();
  }
});

app.get("/example", async function(req, res) {
  try {
    await mongoose.connect(uri);
  } finally {
    mongoose.connection.close();
  }
});

app.get("/dbdebug", async function(req, res) {
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

app.listen(8000, function() {
  global.startDate = new Date();
  console.log(
    `App listening on port 8000 started ${global.startDate.toLocaleString()}`,
  );
});
