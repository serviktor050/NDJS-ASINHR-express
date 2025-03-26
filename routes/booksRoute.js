const express = require('express');
const path = require('path');
const router = express.Router();
const fileMulter = require("../middleware/file");

const { Book, library } = require('../library');

router.get('/books', (req, res) => {
    const {books} = library

    res.render('books/index', {
        title: 'Книги',
        books: books,
    })
})

router.get('/books/create', (req, res) => {
    res.render("books/create", {
        title: "Добавить книгу",
        book: {},
    });
})

router.post('/books/create', (req, res) => {
    const {books} = library
    const {title, description} = req.body;

    const newBook = new Book({
        title,
        description,
    })
    books.push(newBook)

    res.redirect('/books')
})

router.get('/books/:id', (req, res) => {
    const {books} = library
    const {id} = req.params;
    const currentBook = books.find(el => el.id === id)

    if(currentBook) {
        res.render("books/view", {
            title: "О книге",
            book: currentBook,
        });
    } else {
        res.redirect('/404');
    }
});

router.get('/books/update/:id', (req, res) => {
    const {books} = library;
    const {id} = req.params;
    const currentBook = books.find(el => el.id === id)

    if(currentBook) {
        res.render("books/update", {
            title: "Изменить книгу",
            book: currentBook,
        });
    } else {
        res.redirect('/404');
    }
});

router.post('/books/update/:id', (req, res) => {
    const {books} = library;
    const {id} = req.params;
    const {title, description} = req.body;
    const currentBookIdx = books.findIndex(el => el.id === id)

    if (currentBookIdx === -1) {
        res.redirect('/404');
    }

    books[currentBookIdx] = {
        ...books[currentBookIdx],
        title,
        description,
    }
    res.redirect(`/books/${id}`);
});

router.post('/books/delete/:id', (req, res) => {
    const {books} = library;
    const {id} = req.params;
    const currentBookIdx = books.findIndex(el => el.id === id);

    if (currentBookIdx === -1) {
        res.redirect('/404');
    }

    books.splice(currentBookIdx, 1);
    res.redirect(`/books`);
});

/*Роуты для задания с проверкой в Postman*/

router.get('/api/books', (req, res) => {
    const {books} = library

    res.json(books)
})

router.get('/api/books/:id', (req, res) => {
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

router.post('/api/books/',
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

router.put('/api/books/:id',
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

router.delete('/api/books/:id', (req, res) => {
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

router.get('/api/books/:id/download',(req, res) => {
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