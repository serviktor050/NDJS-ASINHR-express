const express = require('express');
const path = require('path');
const router = express.Router();
const fileMulter = require("../middleware/file");

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

router.post('/books/',
    fileMulter.single('fileBook'),
    (req, res) => {
    const {books} = library
    const {
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
        } = req.body
    const {path: fileBook} = req?.file || ''

    const newBook = new Book({
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
        fileBook
    })
    books.push(newBook)

    res.status(201)
    res.json(newBook)
})

router.put('/books/:id',
    fileMulter.single('fileBook'),
    (req, res) => {
    const {path: fileBook} = req?.file || ''

    const {books} = library
    const {id} = req.params
    const currentBook = books.find(el => el.id === id)

    if (currentBook){
        Object.assign(currentBook, {...req.body, fileBook});
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

router.get('/books/:id/download',(req, res) => {
    const {books} = library
    const {id} = req.params
    const currentBook = books.find(el => el.id === id)

    if (currentBook && currentBook.fileBook){
        const filePath = path.resolve(__dirname, '..', 'public', 'books', path.basename(currentBook.fileBook));

        res.download(filePath, (err) => {
            if (err) {
                res.status(500)
                res.json({ message: "Ошибка при загрузке файла" });
            }
        });

    } else {
        res.status(404)
        res.json({message: "Книга не найдена"})
    }
})

module.exports = router;