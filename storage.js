const redis = require('redis');
const { Book } = require('./library');

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost';
const client = redis.createClient({url: REDIS_URL});

(async () => {
    await client.connect();
    console.log('Connected to Redis');
})();

const BOOKS_KEY = 'books:all';

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