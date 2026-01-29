const {v4: uuid} = require("uuid");

class Book {
    constructor(
        {
            id = uuid(),
            title='',
            description='',
            authors='',
            favorite=false,
            fileCover='',
            fileName='',
            fileBook=''
        }
    ) {
        this.id = id
        this.title = title
        this.description = description
        this.authors= authors
        this.favorite= Boolean(favorite);
        this.fileCover= fileCover
        this.fileName= fileName
        this.fileBook= fileBook
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            authors: this.authors,
            favorite: this.favorite,
            fileCover: this.fileCover,
            fileName: this.fileName,
            fileBook: this.fileBook
        };
    }
}

/* Для проверки в Postman */

const library = {
    books: [],
};

module.exports = { Book, library };