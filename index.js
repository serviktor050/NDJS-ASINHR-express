const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const http = require('http');
const socketIO = require('socket.io');
const commentStorage = require('./commentStorage');

const userRoute = require('./routes/userRoute');
const booksRoute = require('./routes/booksRoute');
const mainRoute = require('./routes/mainRoute');

const errorMiddleware = require('./middleware/error');

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.set("view engine", "ejs");

app.use(session({ secret: 'SECRET'}));
app.use(passport.initialize())
app.use(passport.session())

app.use('/', mainRoute);
app.use('/', userRoute);
app.use('/', booksRoute);

app.use(errorMiddleware);

const server = http.Server(app);
const io = socketIO(server);

async function start() {
    try {
        await mongoose.connect('mongodb://root:example@mongo:27017/?authSource=admin');
        console.log('MongoDB connected');
        server.listen(PORT, () => {
            console.log(`Server listening on ${PORT}`);
        })
    } catch (e) {
        console.error(e);
    }
}

io.on('connection', async (socket) => {
    const { id } = socket;
    console.log('connection ' + id);

    const { bookId } = socket.handshake.query;

    if (!bookId) {
        console.warn('No bookId provided');
        return;
    }

    socket.join(bookId);
    console.log('Joined room:', bookId);

    try {
        const comments = await commentStorage.getComments(bookId);
        socket.emit('load-comments', comments);
    } catch (e) {
        console.error('Error loading comments:', e);
    }

    socket.on('msg-to-book', async (msg) => {
        try {
            const comment = {
                username: msg.username || 'Аноним',
                text: msg.text,
                timestamp: new Date().toISOString(),
                socketId: socket.id
            };

            await commentStorage.addComment(bookId, comment);

            io.to(bookId).emit('msg-to-book', comment);

        } catch (e) {
            console.error('Error saving message:', e);
        }
    });

    socket.on('disconnect', () => {
        console.log('disconnect ' + id);
    });
});

const PORT = process.env.PORT || 3000
start()