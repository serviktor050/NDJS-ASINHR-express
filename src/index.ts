import * as express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import * as http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import commentStorage from './commentStorage';

import userRoute from './routes/userRoute';
import booksRoute from './routes/booksRoute';
import mainRoute from './routes/mainRoute';

import errorMiddleware from './middleware/error';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(
    session({
        secret: 'SECRET',
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize())
app.use(passport.session())

app.use('/', mainRoute);
app.use('/', userRoute);
app.use('/', booksRoute);

app.use(errorMiddleware);

const server = http.createServer(app);
const io = new SocketIOServer(server);

async function start(): Promise<void> {
    try {
        await mongoose.connect('mongodb://root:example@mongo:27017/?authSource=admin');
        console.log('MongoDB connected');
        server.listen(PORT, () => {
            console.log(`Server listening on ${PORT}`);
        });
    } catch (e) {
        console.error(e);
    }
}

io.on('connection', async (socket: Socket) => {
    const { id } = socket;
    console.log('connection ' + id);

    const { bookId } = socket.handshake.query;

    if (!bookId) {
        console.warn('No bookId provided');
        return;
    }

    const room = Array.isArray(bookId) ? bookId[0] : bookId;

    socket.join(room);
    console.log('Joined room:', room);

    try {
        const comments = await commentStorage.getComments(room);
        socket.emit('load-comments', comments);
    } catch (e) {
        console.error('Error loading comments:', e);
    }

    socket.on('msg-to-book', async (msg: { username?: string; text: string }) => {
        try {
            const comment = {
                username: msg.username || 'Аноним',
                text: msg.text,
                timestamp: new Date().toISOString(),
                socketId: socket.id,
            };

            await commentStorage.addComment(room, comment);

            io.to(room).emit('msg-to-book', comment);
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