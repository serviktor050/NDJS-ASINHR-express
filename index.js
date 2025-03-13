const express = require('express');

const userRoute = require('./routes/userRoute');
const booksRoute = require('./routes/booksRoute');

const app = express();

app.use(express.json())

app.use('/api/user', userRoute);
app.use('/api', booksRoute);

const PORT = process.env.PORT || 3000
app.listen(PORT)