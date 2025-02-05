import mongoose from 'mongoose';
const { Schema, model } = mongoose;

// Schemas
const UserSchema = new Schema({
    name: String,
    password: String,
    surname: String,
    email: String,
    course: String
});

/*
Per gestire gli eventi che si ripetono all'infinito,
impostiamo un massimo di 3650 record. Considerando
che la frequenza minima {e'} 1 volta al giorno, significa
che vengono inseriti 10 anni di eventi se si ripetono
indefinitamente.

Il campo link in description vale sia per luoghi fisici (Google Maps)
che virtuali.
*/
const EventSchema = new Schema({
    UserEmail: String,
    dates: [
        {
            begin: Date,
            end: Date
        }
    ],
    title: String,
    details: {
        text: String,
        link: String
    }
});

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


const User = model('users', UserSchema);
const Event = model('events', EventSchema);
const Note = model('notes', NoteSchema);

export { User, Event, Note };
// Query per note ordinate in base alla lunghezza di Text
/*
const notes = await Note.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } }, // Filter notes by userId
        { $addFields: { textLength: { $strLenCP: "$text" } } }, // Calculate text length
        { $sort: { textLength: 1 } }, // Sort by text length (ascending)
        { $project: { textLength: 0 } } // Exclude textLength from output
    ]);
*/