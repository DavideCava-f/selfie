import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
global.rootDir = __dirname;

let app = express();
app.use(express.static(path.join(global.rootDir, 'dist')));
app.use(cors());
app.use(express.json());


// MongoDB & Mongoose
const dbName = "selfie232465";
const mongoCredentials = {
	user: "site232465",
	pwd: "uP9ohT3a",
	site: "mongo_site232465"
}
const uri = `mongodb://${mongoCredentials.user}:${mongoCredentials.pwd}@${mongoCredentials.site}/${dbName}?retryWrites=true&w=majority&authSource=admin`;

// Schemas
const UserSchema = new Schema({
    name: String,
    username: String,
    password: String,
    surname: String,
    email: String,
    course: String
});
const User = model('users', UserSchema);

const EventSchema = new Schema({
    UserEmail: String,
    begin: Date,
    end: Date,
    title: String,
    description: String
});
const Event = model('events', EventSchema);

const NoteSchema = new Schema({
    userEmail: String,
    creationDate: Date,
    lastUpDate: Date,
    Title: String,
    Text: String,
    Tags: [{
        name: String
    }]
});
const Note = model('notes', NoteSchema);

// Query per note ordinate in base alla lunghezza di Text
/*
const notes = await Note.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } }, // Filter notes by userId
        { $addFields: { textLength: { $strLenCP: "$text" } } }, // Calculate text length
        { $sort: { textLength: 1 } }, // Sort by text length (ascending)
        { $project: { textLength: 0 } } // Exclude textLength from output
    ]);
*/


/*const scoreSchema = new Schema({
    name: String,
    score: Number
});
const Score = model('scores', scoreSchema);*/

// Functions


// Entry points
app.get('/', (req, res) => {
    res.sendFile(path.join(global.rootDir, 'dist', 'index.html'));
});

app.post('/example', async function(req, res) {
    try {
        await mongoose.connect(uri);
    } finally {
        mongoose.connection.close();
    }
});

app.get('/example', async function(req, res) {
    try {
        await mongoose.connect(uri);
    } finally {
        mongoose.connection.close();
    }
});

app.get('/dbdebug', async function(req, res) {
    try {
        await mongoose.connect(uri);
    } finally {
        mongoose.connection.close();
    }
});

app.listen(8000, function() { 
	global.startDate = new Date() ; 
	console.log(`App listening on port 8000 started ${global.startDate.toLocaleString()}` )
})
