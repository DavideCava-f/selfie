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
import pomodoroRoutes from "./routes/pomodoroRoutes.js";
import usersRoutes from "./routes/usersRoute.js";
import activityRoutes from "./routes/activityRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import verifyToken from "./routes/middleware.js";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
global.rootDir = __dirname;
dotenv.config();
// dotenv.config({ path: `${global.rootDir}/.env` });

// MongoDB & Mongoose
// Atlas dev database
// const uri = process.env.MONGODB_PROD;
const uri = process.env.MONGODB_DEV;

let app = express();

await mongoose.connect(uri);
console.log("Connected to mongoose: " + uri);

// Routes
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.static(path.join(global.rootDir, "dist")));
app.use(cookieParser());
app.use("/note", notesRoutes);
app.use("/event", eventsRoutes);
app.use("/pomodoro", pomodoroRoutes);
app.use("/user", usersRoutes);
app.use("/activity", activityRoutes);
app.use("/notification", notificationRoutes);

app.get("/checkauth", verifyToken, async function(req, res) {
  res.status(200).send();
});

/* DEBUGGING */
app.get("/users", async function(req, res) {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } finally {
  }
});

app.get("/notes", async function(req, res) {
  try {
    const test = await Note.find({});
    res.status(200).json(test);
  } finally {
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(global.rootDir, "dist", "index.html"));
});

app.listen(process.env.PORT_PROD, function() {
  global.startDate = new Date();
  console.log("Server listening");
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});
