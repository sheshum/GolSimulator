const express = require('express');
const cors = require('cors');


const { importPattern } = require('./api.js');


const PORT = 5000;
const app = express();


app.use(cors({origin: '*' }));

app.get('/import', importPattern);

app.listen(PORT, () => console.log('Listening on port ', PORT));
