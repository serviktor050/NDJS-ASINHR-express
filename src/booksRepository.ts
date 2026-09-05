import BookModel, { IBook } from './models/book';

class BooksRepository {
    async createBook(book: Partial<IBook>): Promise<IBook> {
        const newBook = new BookModel(book);
        await newBook.save();
        return newBook;
    }

    async getBook(id: string): Promise<IBook | null> {
        return await BookModel.findById(id).select('-__v');
    }

    async getBooks(): Promise<IBook[]> {
        return await BookModel.find().select('-__v');
    }

    async updateBook(id: string, updatedBook: Partial<IBook>): Promise<IBook | null> {
        return await BookModel.findByIdAndUpdate(id, updatedBook, { new: true });
    }

    async deleteBook(id: string): Promise<{ deletedCount?: number }> {
        return await BookModel.deleteOne({ _id: id });
    }
}

export default BooksRepository;