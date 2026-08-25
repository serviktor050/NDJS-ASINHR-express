interface BookFile {
    fileCover: string
    fileName: string
    fileBook:string
}

interface Book {
    id: string
    title: string
    description: string
    authors: string
    favorite: boolean
    file: BookFile;
}

abstract class BooksRepository {
    abstract createBook(book: Book): void
    abstract getBook(id: string): Book | null
    abstract getBooks(): Book[]
    abstract updateBook(id: string, updatedBook: Book): void
    abstract deleteBook(id: string): void
}