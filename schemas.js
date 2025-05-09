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
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    dates: [
        {
            begin: Date,
            end: Date,
            noted: Boolean
        }
    ],
    title: String,
    details: {
        text: String,
        link: String
    },
    notification: {
        advance: [String],
        untilAck: Boolean
    }
});

const PomodoroSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    beginDate: Date,
    cycles: Number,
    studyMins: Number,
    pauseMins: Number,
})

const NoteSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    creationDate: Date,
    lastUpDate: Date,
    Title: String,
    Text: String,
    markdown: Boolean,
    Tags: [{
        name: String
    }]
});

const ActivitySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    dates: [ //Non serve un array
        {
            creation: Date,
            deadline: Date
        }
    ],
    title: String,
    text: String,
    completed: Boolean,
    notification: { //Ogni campo indica se notificato in quel momento

        isLate: Boolean,
        oneDayLate: Boolean,
        oneWeekLate: Boolean,
    },

});

const User = model('User', UserSchema);
const Event = model('Event', EventSchema);
const Pomodoro = model('Pomodoro', PomodoroSchema);
const Note = model('Note', NoteSchema);
const Activity = model('Activity', ActivitySchema);

export { User, Event, Pomodoro, Note, Activity };
// Query per note ordinate in base alla lunghezza di Text
/*
const notes = await Note.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } }, // Filter notes by userId
        { $addFields: { textLength: { $strLenCP: "$text" } } }, // Calculate text length
        { $sort: { textLength: 1 } }, // Sort by text length (ascending)
        { $project: { textLength: 0 } } // Exclude textLength from output
    ]);
*/
