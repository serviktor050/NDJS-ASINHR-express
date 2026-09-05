import { v4 as uuid } from 'uuid';

export interface BookData {
    id?: string;
    title?: string;
    description?: string;
    authors?: string;
    favorite?: boolean;
    fileCover?: string;
    fileName?: string;
    fileBook?: string;
    count?: number; // опционально, добавляется сервисом счётчика
}

export class Book {
    id: string;
    title: string;
    description: string;
    authors: string;
    favorite: boolean;
    fileCover: string;
    fileName: string;
    fileBook: string;
    count?: number; // добавляется динамически в storage, можно сделать необязательным

    constructor(data: BookData = {}) {
        this.id = data.id ?? uuid();
        this.title = data.title ?? '';
        this.description = data.description ?? '';
        this.authors = data.authors ?? '';
        this.favorite = Boolean(data.favorite);
        this.fileCover = data.fileCover ?? '';
        this.fileName = data.fileName ?? '';
        this.fileBook = data.fileBook ?? '';
        if (data.count !== undefined) {
            this.count = data.count;
        }
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
            fileBook: this.fileBook,
            ...(this.count !== undefined ? { count: this.count } : {}),
        };
    }
}

/* Для проверки в Postman */

export const library = {
    books: [] as Book[],
};
