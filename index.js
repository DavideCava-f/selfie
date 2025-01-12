const express = require('express');
const cors = require('cors')
const path = require('path')

global.rootDir = __dirname;

let app = express();
app.use(express.static(path.join(global.rootDir, 'dist')));
app.use(cors());


app.get('/', (req, res) => {
    res.sendFile(path.join(global.rootDir, 'dist', 'index.html'));
});

app.listen(8000, function() { 
	global.startDate = new Date() ; 
	console.log(`App listening on port 8000 started ${global.startDate.toLocaleString()}` )
})
