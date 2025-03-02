import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { User, Event, Note } from "./schemas.js";
import notesRoutes from "./routes/notesRoutes.js";
import eventsRoutes from "./routes/eventsRoutes.js";
import usersRoutes from "./routes/usersRoute.js";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
global.rootDir = __dirname;
dotenv.config();

// MongoDB & Mongoose
// Atlas dev database
const uri = process.env.MONGODB_DEV;

let app = express();

// Routes
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.static(path.join(global.rootDir, "dist")));
app.use(cookieParser());
app.use("/note", notesRoutes);
app.use("/event", eventsRoutes);
app.use("/user", usersRoutes);

app.post("/login", async (req, res) => {
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

app.listen(process.env.PORT_PROD, function() {
  global.startDate = new Date();
  console.log(
    `App listening on port ${process.env.PORT_PROD} started ${global.startDate.toLocaleString()}`,
  );
});
