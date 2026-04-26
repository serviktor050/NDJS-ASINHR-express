const redis = require('redis');

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost';
const client = redis.createClient({ url: REDIS_URL });

(async () => {
    await client.connect();
})();

class CommentStorage {
    async getComments(bookId) {
        try {
            const key = `comments:${bookId}`;
            const comments = await client.get(key);
            return comments ? JSON.parse(comments) : [];
        } catch (e) {
            console.error('Error getComments:', e);
            return [];
        }
    }

    async addComment(bookId, comment) {
        const key = `comments:${bookId}`;
        const comments = await this.getComments(bookId);

        comments.push(comment);

        await client.set(key, JSON.stringify(comments));
        return comment;
    }
}

module.exports = new CommentStorage();