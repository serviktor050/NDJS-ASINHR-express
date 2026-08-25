const { Container } = require('inversify');
const BooksRepository = require('./booksRepository');

const container = new Container();

container.bind(BooksRepository).toSelf();

module.exports = container;
