import { createClient } from 'redis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost';
const client = createClient({ url: REDIS_URL });

(async () => {
    await client.connect();
})();

export interface Comment {
    username: string;
    text: string;
    timestamp: string;
    socketId: string;
}

class CommentStorage {
    async getComments(bookId: string): Promise<Comment[]> {
        try {
            const key = `comments:${bookId}`;
            const comments = await client.get(key);
            if (!comments) return [];

            const parsed: unknown = JSON.parse(comments.toString());
            if (!Array.isArray(parsed)) return [];

            return parsed as Comment[];
        } catch (e) {
            console.error('Error getComments:', e);
            return [];
        }
    }

    async addComment(bookId: string, comment: Comment): Promise<Comment> {
        const key = `comments:${bookId}`;
        const comments = await this.getComments(bookId);

        comments.push(comment);

        await client.set(key, JSON.stringify(comments));
        return comment;
    }
}

export default new CommentStorage();