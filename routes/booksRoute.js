const express = require('express');
const router = express.Router();

const { Book, library } = require('../library');

router.get('/books', (req, res) => {
    const {books} = library

    res.json(books)
})

router.get('/books/:id', (req, res) => {
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

router.post('/books/', (req, res) => {
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

router.put('/books/:id', (req, res) => {
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

router.delete('/books/:id', (req, res) => {
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

module.exports = router;