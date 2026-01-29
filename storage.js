const redis = require('redis');
const axios = require('axios');
const { Book } = require('./library');

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost';
const COUNTER_SERVICE_URL = process.env.COUNTER_SERVICE_URL || 'http://counter:3002';

const client = redis.createClient({url: REDIS_URL});

(async () => {
    await client.connect();
    console.log('Connected to Redis');
})();

const BOOKS_KEY = 'books:all';

const counterService = axios.create({
    baseURL: COUNTER_SERVICE_URL,
    timeout: 5000
});

class BookStorage {
    async getAllBooks() {
        try {
            const booksJson = await client.get(BOOKS_KEY);
            return booksJson ? JSON.parse(booksJson).map(data => new Book(data)) : [];
        } catch (error) {
            console.error('Error getting all books:', error);
            return [];
        }
    }

    async getBookById(id) {
        const books = await this.getAllBooks();
        const book = books.find(book => book.id === id) || null;

        if (book) {
            try {
                console.log(`Fetching counter for book ${id} from ${COUNTER_SERVICE_URL}`);
                const response = await counterService.get(`/counter/${id}`);
                console.log(`Counter response for ${id}:`, response.data);
                book.count = response.data.count || 0;

                await counterService.post(`/counter/${id}/incr`);
                console.log(`Counter incremented for ${id}`);
            } catch (counterError) {
                console.warn('Counter service unavailable:', counterError.message);
                console.warn('Full error:', counterError);
                book.count = 0;
            }
        }
        return book;
    }

    async saveBook(book) {
        const books = await this.getAllBooks();
        books.push(book);
        await client.set(BOOKS_KEY, JSON.stringify(books));
        return book;
    }

    async updateBook(books, id, updates) {
        const index = books.findIndex(book => book.id === id);

        books[index] = { ...books[index], ...updates };
        await client.set(BOOKS_KEY, JSON.stringify(books));
        return books[index];
    }

    async deleteBook(id) {
        const books = await this.getAllBooks();
        const filteredBooks = books.filter(book => book.id !== id);

        if (filteredBooks.length === books.length) return false;

        await client.set(BOOKS_KEY, JSON.stringify(filteredBooks));
        return true;
    }
}

module.exports = new BookStorage();