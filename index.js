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
import activityRoutes from "./routes/activityRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import verifyToken from "./routes/middleware.js";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
global.rootDir = __dirname;
dotenv.config();
//dotenv.config({ path: `${global.rootDir}/.env` });

// MongoDB & Mongoose
// Atlas dev database
//const uri = process.env.MONGODB_PROD;
const uri = process.env.MONGODB_DEV;
console.log(uri);

let app = express();

await mongoose.connect(uri);
console.log("MongoDB connection settled");

// Routes
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.static(path.join(global.rootDir, "dist")));
app.use(cookieParser());
app.use("/note", notesRoutes);
app.use("/event", eventsRoutes);
app.use("/user", usersRoutes);
app.use("/activity", activityRoutes);

app.get("/checkauth", verifyToken, async function(req, res) {
  res.status(200).send();
});

app.get("/users", async function(req, res) {
  try {
    const users = await User.find({});
    res.json(users);
  } finally {
  }
});

app.get("/dbdebug", async function(req, res) {
  try {
    const test = await Note.find({});
    res.json(test);
  } finally {
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

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed");
  process.exit(0);
});
