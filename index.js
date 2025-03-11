const express = require('express');
const {v4: uuid} = require('uuid');

class Book {
    constructor(
        {
            id = uuid(),
            title='',
            description='',
            authors='',
            favorite='',
            fileCover='',
            fileName='',
        }
    ) {
        this.id = id
        this.title = title
        this.description = description
        this.authors= authors
        this.favorite= favorite
        this.fileCover= fileCover
        this.fileName= fileName
    }
}

const library = {
    books: [],
};

const app = express();
app.use(express.json())

app.post('/api/user/login', (req, res) => {
    const user = {
        id: 1,
        mail: "test@mail.ru"
    }

    res.status(201)
    res.json(user)
})

app.get('/api/books', (req, res) => {
    const {books} = library

    res.json(books)
})

app.get('/api/books/:id', (req, res) => {
    const {books} = library
    const {id} = req.params
    const currentBook = books.find(el => el.id === id)

    if(currentBook) {
        res.json(currentBook)
    } else {
        res.status(404)
        res.json({message: "Книга не найдена"})
    }
})

app.post('/api/books/', (req, res) => {
    const {books} = library
    const {
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName
    } = req.body

    const newBook = new Book({
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName
    })
    books.push(newBook)

    res.status(201)
    res.json(newBook)
})

app.put('/api/books/:id', (req, res) => {
    const {books} = library
    const {id} = req.params
    const currentBook = books.find(el => el.id === id)

    if (currentBook){
        Object.assign(currentBook, req.body);
        res.json(currentBook)
    } else {
        res.status(404)
        res.json({message: "Книга не найдена"})
    }
})

app.delete('/api/books/:id', (req, res) => {
    const {books} = library
    const {id} = req.params
    const idx = books.findIndex(el => el.id === id)

    if(idx !== -1){
        books.splice(idx, 1)
        res.json({message: "Ok"})
    } else {
        res.status(404)
        res.json({message: "Книга не найдена"})
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT)