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
const uri = "mongodb+srv://nicola1travaglini:testtest@test.pe0yf.mongodb.net/keybench?retryWrites=true&w=majority&appName=Test";
mongoose.connect(uri);
const scoreSchema = new Schema({
    name: String,
    score: Number
});
const Score = model('scores', scoreSchema);


// Functions


// Entry points
app.get('/', (req, res) => {
    res.sendFile(path.join(global.rootDir, 'dist', 'index.html'));
});

app.post('/insertScore', async function(req, res) {
    try {
        const newScoreId = await Score.create({
            name: req.body["name"],
            score: req.body["score"]
        });
    } finally {
    }
});

app.get('/leaderboard', async function(req, res) {
    try {
        const scores = await Score.find({}).sort({score: -1}).limit(10);
        res.json(scores);
    } finally {
    }
});

app.listen(8000, function() { 
	global.startDate = new Date() ; 
	console.log(`App listening on port 8000 started ${global.startDate.toLocaleString()}` )
})
