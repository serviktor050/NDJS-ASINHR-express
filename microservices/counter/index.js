const express = require('express');
const redis = require('redis');

const app = express();

const PORT = process.env.PORT || 3002
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost';

const client = redis.createClient({ url: REDIS_URL });

(async () => {
    await client.connect();
    console.log('Counter service connected to Redis');
})();

const GET_COUNTER_REY = (bookId) => `counter:book:${bookId}`;

app.get('/counter/:bookId', async (req, res) => {
    try {
        const { bookId } = req.params;
        const key = GET_COUNTER_REY(bookId);
        const count = await client.get(key);

        res.json({ bookId, count });
    } catch (error) {
        console.error('Error getting counter:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/counter/:bookId/incr', async (req, res) => {
    try {
        const { bookId } = req.params;
        const key = GET_COUNTER_REY(bookId);
        const newCount = await client.incr(key);
        await client.expire(key, 90 * 24 * 60 * 60);

        res.json({ bookId, count: newCount });
    } catch (error) {
        console.error('Error incrementing counter:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT)

console.log(`Counter service listening on ${PORT}`);
