import 'reflect-metadata';
import { Container } from 'inversify';
import BooksRepository from './booksRepository';

const container = new Container();

container.bind<BooksRepository>(BooksRepository).toSelf();

export default container;
