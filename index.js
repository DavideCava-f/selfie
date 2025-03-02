import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { User, Event, Note } from "./schemas.js";
import notesRoutes from "./routes/notesRoutes.js";
import eventsRoutes from "./routes/eventsRoutes.js";

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

// Routes
app.use("/note", notesRoutes);
app.use("/event", eventsRoutes);

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
      return res.status(401).json({ error: "Authentication failed" });
    }
    const passwordMatch = password === user.password;
    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    // FIXME: la chiave segreta del server dev'essere dinamica
    const token = jwt.sign({ userId: user._id }, "CHIAVE CON LA Q", {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
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
