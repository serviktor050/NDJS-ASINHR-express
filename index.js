const express = require('express');

const userRoute = require('./routes/userRoute');
const booksRoute = require('./routes/booksRoute');
const mainRoute = require('./routes/mainRoute');

const errorMiddleware = require('./middleware/error');

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.set("view engine", "ejs");

app.use('/', mainRoute);
app.use('/api/user', userRoute);
app.use('/', booksRoute);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000
app.listen(PORT)