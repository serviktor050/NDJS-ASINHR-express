import { Schema, model, Document } from 'mongoose';

export interface IBook extends Document {
    id: string;
    title: string;
    description: string;
    authors: string;
    favorite: boolean;
    fileCover: string;
    fileName: string;
    fileBook?: string;
}

const bookSchema = new Schema<IBook>({
    id: {
        type: String,
        required: true, // id генерируется через uuid, должен быть обязательным
    },
    title: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: '',
    },
    authors: {
        type: String,
        default: '',
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    fileCover: {
        type: String,
        default: '',
    },
    fileName: {
        type: String,
        default: '',
    },
    fileBook: {
        type: String,
        default: '',
    },
});

const BookModel = model<IBook>('Book', bookSchema);

export default BookModel;