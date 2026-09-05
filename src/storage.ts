import { createClient } from 'redis';
import axios from 'axios';
import { Book } from './library';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost';
const COUNTER_SERVICE_URL = process.env.COUNTER_SERVICE_URL || 'http://counter:3002';

const client = createClient({ url: REDIS_URL });

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
    async getAllBooks(): Promise<Book[]> {
        try {
            const booksJson = await client.get(BOOKS_KEY);
            if (!booksJson) return [];

            const parsed: unknown = JSON.parse(booksJson.toString());
            if (!Array.isArray(parsed)) return [];

            return parsed.map((data: unknown) => new Book(data as Partial<Book>));
        } catch (error) {
            console.error('Error getting all books:', error);
            return [];
        }
    }

    async getBookById(id: string): Promise<Book | null> {
        const books = await this.getAllBooks();
        const book = books.find((book: Book) => book.id === id) || null;

        if (book) {
            try {
                console.log(`Fetching counter for book ${id} from ${COUNTER_SERVICE_URL}`);
                const response = await counterService.get(`/counter/${id}`);
                console.log(`Counter response for ${id}:`, response.data);

                book.count = response.data.count || 0;

                await counterService.post(`/counter/${id}/incr`);
                console.log(`Counter incremented for ${id}`);
            } catch (counterError: unknown) {
                const errorMessage =
                    counterError instanceof Error ? counterError.message : 'Unknown error';
                console.warn('Counter service unavailable:', errorMessage);
                console.warn('Full error:', counterError);
                book.count = 0;
            }
        }
        return book;
    }

    async saveBook(book: Book): Promise<Book> {
        const books = await this.getAllBooks();
        books.push(book);
        await client.set(BOOKS_KEY, JSON.stringify(books));
        return book;
    }

    async updateBook(
        books: Book[],
        id: string,
        updates: Partial<Book>
    ): Promise<Book | null> {
        const index = books.findIndex((book: Book) => book.id === id);
        if (index === -1) return null;

        books[index] = Object.assign(books[index], updates);
        await client.set(BOOKS_KEY, JSON.stringify(books));
        return books[index];
    }

    async deleteBook(id: string): Promise<boolean> {
        const books = await this.getAllBooks();
        const filteredBooks = books.filter((book: Book) => book.id !== id);

        if (filteredBooks.length === books.length) return false;

        await client.set(BOOKS_KEY, JSON.stringify(filteredBooks));
        return true;
    }
}

export default new BookStorage();