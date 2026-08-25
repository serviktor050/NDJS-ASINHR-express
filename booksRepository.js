const BookSchema = require('./models/book');

class BooksRepository {
    async createBook(book) {
        const newBook = new BookSchema(book);
        await newBook.save();
        return newBook;
    }

    async getBook(id) {
        return await BookSchema.findById(id).select('-__v');
    }

    async getBooks() {
        return await BookSchema.find().select('-__v');
    }

    async updateBook(id, updatedBook) {
        return await BookSchema.findByIdAndUpdate(id, updatedBook, { new: true });
    }

    async deleteBook(id) {
        return await BookSchema.deleteOne({ _id: id });
    }
}

module.exports = BooksRepository;