const express = require('express');
const mongoose = require('mongoose');

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

async function start() {
    try {
        await mongoose.connect('mongodb://root:example@mongo:27017/?authSource=admin');
        console.log('MongoDB connected');
        app.listen(PORT, () => {
            console.log(`Listening on ${PORT}`);
        });
    } catch (e) {
        console.error(e);
    }
}

const PORT = process.env.PORT || 3000
start()