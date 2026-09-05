import * as multer from 'multer';
import { Request } from 'express';

const storage = multer.diskStorage({
    destination(
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, destination: string) => void
    ) {
        cb(null, 'public/books');
    },
    filename(
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, filename: string) => void
    ) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

export default multer({ storage });